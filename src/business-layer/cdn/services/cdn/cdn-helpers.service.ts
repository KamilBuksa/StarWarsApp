import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { FILE_CONTENT_TYPE } from '../../../../data-access-layer/file-entity/entities/content.type';
import { FileEntity } from '../../../../data-access-layer/file-entity/entities/file.entity';
import { FILE_TYPE } from '../../../../data-access-layer/file-entity/entities/file.type';
import { FileRepositoryService } from '../../../../data-access-layer/file-entity/services/file-repository.service';
import { UserRepositoryService } from '../../../../data-access-layer/user-entity/providers/user.repository.service';
import { CDNModel } from '../../models/cdn.model';
import { MulterModel } from '../../models/multer.model';
import { HandleFilesToAssignOptionsInterface } from '../../types/cdn.types.dto';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { FILE_STATUS } from '../../../../data-access-layer/file-entity/entities/file.status';
import { CdnUtils } from '../../cdn-utils';

@Injectable()
export class CdnHelpersService {
  constructor(
    private readonly _fileRepositoryService: FileRepositoryService,
    private readonly _userRepositoryService: UserRepositoryService,
  ) { }

  async handleFilesToAssign(
    files: {
      fileId: string;
      contentType?: FILE_CONTENT_TYPE;
      type: FILE_TYPE;
      status?: FILE_STATUS;
    }[],
    options: HandleFilesToAssignOptionsInterface,
  ): Promise<{ filesToAssign: FileEntity[] }> {
    let filesToAssign = [];
    if (Array.isArray(files) && files.length) {
      filesToAssign = [];

      const seen = new Set();
      const uniqueFiles = files.filter((el) => {
        const duplicate = seen.has(el.fileId);
        seen.add(el.fileId);
        return !duplicate;
      });
      const findFiles =
        await this._fileRepositoryService.findAllByIdsWithOnlyIds(
          uniqueFiles.map((el) => el.fileId),
          options.user.id,
        );

      let startOrderFrom = options?.startOrderFrom ?? 0;
      for await (const file of files) {
        const findFile = findFiles.find((f) => f.id === file.fileId);
        if (!findFile)
          throw new NotFoundException(`File ${file.fileId} not found`);
        findFile.isAssigned = true;
        findFile.contentType = file.contentType ?? FILE_CONTENT_TYPE.FILE;
        findFile.type = file.type;
        findFile.order = startOrderFrom;
        findFile.status = file.status;
        if (options?.user) findFile.user = options.user;
        if (options?.isPublic) findFile.isPublic = options.isPublic;

        filesToAssign.push(findFile);

        if (findFile?.compressFile) {
          findFile.compressFile.isAssigned = true;
          findFile.compressFile.contentType = file.contentType;
          findFile.compressFile.type = file.type;
          findFile.compressFile.order = startOrderFrom;
          findFile.compressFile.status = file.status;

          if (options?.user) findFile.compressFile.user = options.user;
          if (options?.isPublic)
            findFile.compressFile.isPublic = options.isPublic;



          filesToAssign.push(findFile.compressFile);
        }
        startOrderFrom++;
      }
    }

    return { filesToAssign };
  }

  async handleFilesToRemove(ids: string[], userId: string): Promise<void> {
    if (Array.isArray(ids) && ids.length) {
      const findFiles =
        await this._fileRepositoryService.findAllByIdsWithOnlyIds(
          ids,
          userId,
          true,
        );
      for await (const file of findFiles) {
        await this.deleteFile(file.path, file.type);
        if (file.compressFile) {
          await this.deleteFile(file.compressFile.path, file.compressFile.type);
        }
      }
      await this._fileRepositoryService.softDeleteMany(ids);
    }
  }

  async handleFilesToRemoveByAdmin(ids: string[]): Promise<void> {
    if (Array.isArray(ids) && ids.length) {
      const findFiles =
        await this._fileRepositoryService.findAllByIdsWithOnlyIdsForAdmin(
          ids,
          true,
        );
      for await (const file of findFiles) {
        await this.deleteFile(file.path, file.type, true);
        if (file.compressFile) {
          await this.deleteFile(
            file.compressFile.path,
            file.compressFile.type,
            true,
          );
        }
      }
      await this._fileRepositoryService.softDeleteMany(ids);
    }
  }


  async softDeleteFromDbAndRemoveFile(fileEntity: FileEntity): Promise<void> {
    if (fileEntity) {
      await this._fileRepositoryService.softDelete(fileEntity.id);
      await this.deleteFile(fileEntity.path, fileEntity.type);

      if (fileEntity?.compressFile) {
        await this._fileRepositoryService.softDelete(
          fileEntity.compressFile.id,
        );
        await this.deleteFile(
          fileEntity.compressFile.path,
          fileEntity.compressFile.type,
        );
      }
    }
  }

  async deleteFile(url: string, type: FILE_TYPE, skipType?: boolean) {
    if (
      (url && CDNModel.TYPES_AVAILABLE_TO_DELETE.includes(type)) ||
      (url && skipType)
    ) {
      const fullUrl = MulterModel.convertToUniversalUrl(url);
      const absolutePathToPhoto = path.resolve(fullUrl);
      if (await CdnUtils.checkFileExists(absolutePathToPhoto)) {
        await CdnUtils.deleteFile(absolutePathToPhoto);
      }
    }
  }
}
