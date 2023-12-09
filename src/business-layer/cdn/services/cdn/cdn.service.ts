import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as path from 'path';

import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FileEntity } from '../../../../data-access-layer/file-entity/entities/file.entity';
import { FileRepositoryService } from '../../../../data-access-layer/file-entity/services/file-repository.service';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../../generated/i18n.generated';
import { ApiModel } from '../../../../models/api.model';
import { CDNModel } from '../../models/cdn.model';
import { MulterModel } from '../../models/multer.model';
import { CdnWorkerService } from '../../workers/cdn-workers.service';
import { CdnHelpersService } from './cdn-helpers.service';
import { CdnUtils } from '../../cdn-utils';
@Injectable()
export class CdnService {
  constructor(
    private readonly _fileRepositoryService: FileRepositoryService,
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _cdnHelpersService: CdnHelpersService,
    private readonly _cdnWorkerService: CdnWorkerService,
  ) {}

  async handleUploadedFile(
    file: CDNModel.UploadedFile,
    user: UserEntity,
  ): Promise<CDNModel.UploadedFileResponse> {
    if (!file) {
      throw new NotFoundException({ key: 'validation.FILE_NOT_FOUND' } as {
        key: I18nPath;
      });
    }
    const fileEntity: FileEntity = await this.saveFile(file, false, user);

    if (MulterModel.arrayOfAvailableToCompress.includes(file?.mimetype)) {
      await this.compressFile(fileEntity, file);
    }

    // handle heic files
    await this.convertHeicToJpg(fileEntity, file, user.id);

    return {
      fileId: fileEntity.id,
    };
  }

  async showFile(fileId: string, user: UserEntity): Promise<string> {
    const file: FileEntity = await this._fileRepositoryService.findOneById(
      fileId,
      { userId: user.id, role: user.role },
      {
        isAssigned: true,
      },
    );

    if (!file)
      throw new NotFoundException({ key: 'validation.FILE_NOT_FOUND' } as {
        key: I18nPath;
      });

    const filePath: undefined | string = path.resolve(file.path);
    if (await CdnUtils.checkFileExists(filePath)) {
      return filePath;
    } else {
      throw new NotFoundException({ key: 'validation.FILE_NOT_FOUND' } as {
        key: I18nPath;
      });
    }
  }

  async showFileByUrl(query: CDNModel.FilesUrlDTO): Promise<string> {
    const { fileId } = query;
    const file = await this._fileRepositoryService.findOneByIdForPublicAccess(
      fileId,
    );
    if (!file)
      throw new NotFoundException({ key: 'validation.FILE_NOT_FOUND' } as {
        key: I18nPath;
      });

    if (!file.isPublic) {
      throw new ForbiddenException({ key: 'validation.FORBIDDEN' } as {
        key: I18nPath;
      });
    }

    const filePath: undefined | string = path.resolve(file.path);

    if (await CdnUtils.checkFileExists(filePath)) {
      return filePath;
    } else {
      throw new NotFoundException({ key: 'validation.FILE_NOT_FOUND' } as {
        key: I18nPath;
      });
    }
  }

  async deleteFile(
    fileId: string,
    user: { userId: string; role: USER_ROLE },
  ): Promise<ApiModel.StatusResponse> {
    const findFile: FileEntity = await this._fileRepositoryService.findOneById(
      fileId,
      user,
      { isAssigned: true },
    );
    if (!findFile)
      throw new NotFoundException({ key: 'validation.FILE_NOT_FOUND' } as {
        key: I18nPath;
      });

    await this._cdnHelpersService.softDeleteFromDbAndRemoveFile(findFile);

    return { status: true };
  }

  async saveFile(
    file: any,
    isCompress: boolean,
    user: UserEntity,
  ): Promise<FileEntity> {
    const fileEntity = new FileEntity();
    fileEntity.filename = file.filename;
    fileEntity.originalname = file.originalname;
    fileEntity.encoding = file.encoding;
    fileEntity.mimetype = file.mimetype;
    fileEntity.path = MulterModel.convertToUniversalUrl(file.path);
    fileEntity.size = file.size;
    fileEntity.isCompress = isCompress;
    fileEntity.user = user;
    const newFile = await this._fileRepositoryService.save(fileEntity);
    return newFile;
  }

  async compressFile(fileEntity: FileEntity, file: any): Promise<void> {
    const fullPathToFile = MulterModel.convertToUniversalUrl(
      path.join(process.cwd(), `${fileEntity.path}`),
    );
    const filename = fileEntity.filename.split('.')[0];
    const pathToCompressionFile = path.join(
      `${MulterModel.UPLOAD_DIR}`,
      `${filename}_compression${path.extname(fileEntity.filename)}`,
    );

    // const workerPath = './src/workers/worker.sharp-compression.js';

    const compressionResultPromise =
      this._cdnWorkerService.sharpCompressionWorker.run({
        fullPathToFile,
        pathToCompressionFile,
      });

    compressionResultPromise.then((compressionResult) => {
      if (compressionResult.status) {
        file.filename = `${filename}_compression${path.extname(
          fileEntity.filename,
        )}`;
        file.path = pathToCompressionFile;
        const compressFileEntity = this.saveFile(
          file,
          true,
          fileEntity.user,
        ).then((compressFileEntity) => {
          if (compressFileEntity.id) {
            this._fileRepositoryService.update(fileEntity.id, {
              compressFile: compressFileEntity,
            });
          }
        });
      }
    });
  }

  async convertHeicToJpg(fileEntity: FileEntity, file: any, userId: string) {
    if (file.mimetype === 'image/heic') {
      const compressionResultPromise = this._cdnWorkerService.convertHeicToJpg(
        MulterModel.UPLOAD_DIR,
        fileEntity.filename,
        fileEntity.path,
      );

      compressionResultPromise.then(async (compressionResult) => {
        try {
          if (compressionResult.status) {
            await this._cdnHelpersService.deleteFile(
              fileEntity.path,
              null,
              true,
            );
            const updatedFileData: QueryDeepPartialEntity<FileEntity> = {
              path: compressionResult.pathToSaveConvertedFile,
              filename: `${fileEntity.filename.split('.')[0]}.jpg`,
              mimetype: 'image/jpeg',
              originalname: `${fileEntity.originalname.split('.')[0]}.jpg`,
              // isConvertedFileReadyToWatch: true
            };

            await this._fileRepositoryService.update(
              fileEntity.id,
              updatedFileData,
            );
            const fileToCompress =
              await this._fileRepositoryService.findOneByUserIdAndFileId(
                userId,
                fileEntity.id,
              );
            if (fileToCompress) {
              await this.compressFile(fileToCompress, file);
            }
          }
        } catch (error) {
          console.error('Wystąpił błąd podczas przetwarzania pliku:', error);
        }
      });
    }
  }

  // remove not assigned files older than 1 day
  @Cron(CronExpression.EVERY_11_HOURS)
  async removeNotAssignedFiles() {
    console.info('Cron run - remove not assigned files older than 1 day');
    const dayBefore = moment().subtract(1, 'd').toDate();
    const findFilesToRemove =
      await this._fileRepositoryService.findFilesForCronRemove(dayBefore);
    const fileToRemoveWithoutUser = [];
    for await (const file of findFilesToRemove) {
      delete file.user;
      fileToRemoveWithoutUser.push(file);
      await this._cdnHelpersService.deleteFile(file.path, file.type, true);
    }
    await this._fileRepositoryService.remove(...fileToRemoveWithoutUser);
  }
}
