import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
import { Injectable } from '@nestjs/common';
import { FILE_TYPE } from '../entities/file.type';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { USER_ROLE } from '../../user-entity/entities/enums/user.roles';
import { isArray } from '../../../utils/other.utils';

@Injectable()
export class FileRepositoryService extends AbstractCrudRepositoryService<FileEntity> {
  constructor(
    @InjectRepository(FileEntity)
    readonly _fileRepository: Repository<FileEntity>,
  ) {
    super(_fileRepository);
  }

  async findAllUserFilesForDeleteProfile(
    userId: string,
  ): Promise<FileEntity[]> {
    let query = this._fileRepository
      .createQueryBuilder('file')
      .leftJoin('file.user', 'user');
    // .where('file.type IN (:...types)', {
    //   types: [FILE_TYPE.GALLERY, FILE_TYPE.USER_AVATAR],
    // })
    query = query.andWhere('user.id = :userId', { userId });
    const files: FileEntity[] | undefined = await query.getMany();

    return files;
  }

  async findOneByUserIdAndFileId(
    userId: string,
    fileId: string,
  ): Promise<FileEntity> {
    let query = this._fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.compressFile', 'compressFile')

      .leftJoinAndSelect('file.user', 'user')

      .where('file.id = :fileId', {
        fileId,
      })
      .andWhere('user.id = :userId', {
        userId,
      });

    return await query
      .select('file')
      .addSelect('compressFile')
      .addSelect('user.id')

      .getOne();
  }

  async findOneById(
    fileId: string,
    user: { userId: string; role: USER_ROLE },
    options?: { isAssigned: boolean | null },
  ): Promise<FileEntity> {
    let query = this._fileRepository
      .createQueryBuilder('file')
      .leftJoin('file.user', 'user')
      .leftJoin('file.compressFile', 'compressFile');
    query.where('file.id = :fileId', {
      fileId,
    });

    if (
      [true, false].includes(options?.isAssigned) &&
      user?.role !== USER_ROLE.ADMIN
    ) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('file.isAssigned = :isAssigned', {
            isAssigned: true,
          }).orWhere(
            new Brackets((qb2) => {
              qb2.where('file.isAssigned = :isAssigned2', {
                isAssigned2: false,
              });
              qb2.andWhere('user.id = :userIdForIsAssignedFilter', {
                userIdForIsAssignedFilter: user.userId,
              });
            }),
          );
        }),
      );
    } else {
      // next
    }
    if (user?.role === USER_ROLE.ADMIN) {
      // next
    } else {
      if (user?.userId) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('user.id = :userId', {
              userId: user.userId,
            }).orWhere('file.isPublic = :isPublic', {
              isPublic: true,
            });
          }),
        );
      } else {
        query.andWhere('file.isPublic = :isPublic', {
          isPublic: true,
        });
      }
    }
    const file: FileEntity | undefined = await query.getOne();
    return file;
  }

  async findOneFileByUserIdAndFileIdAndType(
    fileId: string,
    userId: string,
    type: FILE_TYPE,
    order?: number,
  ): Promise<FileEntity> {
    let query = this._fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.user', 'user');

    query = query
      .where('file.type = :type', {
        type,
      })
      .andWhere('user.id = :userId', {
        userId,
      });
    if (fileId) {
      query = query.andWhere('file.id = :fileId', {
        fileId,
      });
    }

    if (order) {
      query = query.andWhere(
        'file.order = :order AND file.notCompressFileId IS NULL',
        {
          order,
        },
      );
    }

    const file: FileEntity | undefined = await query.getOne();

    return file;
  }

  async findAllByIdsWithOnlyIds(
    ids: string[],
    userId: string,
    isAssigned?: boolean,
  ): Promise<FileEntity[]> {
    const query = this._fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.compressFile', 'compressFile')
      .leftJoin('file.user', 'user')
      .where('file.id IN (:...ids)', {
        ids,
      })
      .andWhere('user.id = :userId', { userId });
    if (isAssigned) {
      query.andWhere('file.isAssigned = :isAssigned', { isAssigned });
    } else {
      query.andWhere('file.isAssigned <> :isAssigned', { isAssigned: true });
    }

    return await query.getMany();
  }

  async findAllByIdsWithOnlyIdsForAdmin(
    ids: string[],
    isAssigned?: boolean,
  ): Promise<FileEntity[]> {
    const query = this._fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.compressFile', 'compressFile')
      .leftJoin('file.user', 'user')
      .where('file.id IN (:...ids)', {
        ids,
      });
    if (isAssigned) {
      query.andWhere('file.isAssigned = :isAssigned', { isAssigned });
    } else {
      query.andWhere('file.isAssigned <> :isAssigned', { isAssigned: true });
    }

    return await query.getMany();
  }

  async findFilesForCronRemove(date?: Date): Promise<FileEntity[]> {
    const query = this._fileRepository
      .createQueryBuilder('file')
      .where('file.isAssigned = :val', { val: false })
      .andWhere(':date > file.createdAt', { date });

    return await query.select(['file.id', 'file.path', 'file.type']).getMany();
  }

  async findOneByIdForPublicAccess(fileId: string): Promise<FileEntity> {
    const query = this._fileRepository
      .createQueryBuilder('file')
      .innerJoin('file.user', 'user');
    query
      .where('file.id = :fileId', {
        fileId,
      })
      .andWhere('file.isAssigned = :isAssigned', {
        isAssigned: true,
      });

    const file: FileEntity | undefined = await query.getOne();
    return file;
  }
}
