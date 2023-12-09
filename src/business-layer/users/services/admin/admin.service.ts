import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException
} from '@nestjs/common';

import { FileRepositoryService } from '../../../../data-access-layer/file-entity/services/file-repository.service';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../../generated/i18n.generated';
import { ApiModel } from '../../../../models/api.model';
import { handleError } from '../../../../utils/other.utils';
import { CdnHelpersService } from '../../../cdn/services/cdn/cdn-helpers.service';
import { AdminUsersQuery } from '../../dtos/request/get.user.dto';
import { UserStatusDTO } from '../../dtos/request/update.user.dto';
import { UserListAdminResponseDTO } from '../../dtos/response/user-list.res.dto';
import {
  UserAdminResponseDTO,
  UserDetailsAdminResponseDTO,
} from '../../dtos/response/user.res.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _fileRepositoryService: FileRepositoryService,
    private readonly _cdnHelpersService: CdnHelpersService,

  ) { }

  async changeUserStatus(data: UserStatusDTO): Promise<UserAdminResponseDTO> {
    let response: undefined | UserAdminResponseDTO;
    // change user status
    if (data.userId && data.status) {
      const userEntity: UserEntity =
        await this._userRepositoryService.findOneByIdPure(data.userId);

      if (!userEntity) {
        throw new NotFoundException({ key: 'validation.USER_NOT_FOUND' } as {
          key: I18nPath;
        });
      }

      if (data.status === USER_STATUS.DELETED) {
        const findUserFiles =
          await this._fileRepositoryService.findAllUserFilesForDeleteProfile(
            userEntity.id,
          );
        if (Array.isArray(findUserFiles) && findUserFiles.length) {
          for await (const file of findUserFiles) {
            await this._cdnHelpersService.deleteFile(file.path, file.type);
          }
        }

        await this._fileRepositoryService.softDeleteMany(
          findUserFiles.map((file) => file.id),
        );
        userEntity.status = USER_STATUS.DELETED;
        await this._userRepositoryService.save(userEntity);
        await this._userRepositoryService.softDelete(userEntity.id);
      }

      if (data.status === USER_STATUS.BLOCKED) {
        userEntity.status = USER_STATUS.BLOCKED;
      }

      if (data.status === USER_STATUS.ACTIVATED) {
        userEntity.status = USER_STATUS.ACTIVATED;
      }

      const updateUserEntity = await this._userRepositoryService.save(
        userEntity,
      );
      response = new UserAdminResponseDTO(updateUserEntity);
    }

    if (!response)
      throw new MethodNotAllowedException({
        key: 'validation.MAKE_SURE_THE_DATA_YOU_SUBMITTED_IS_CORRECT',
      } as { key: I18nPath });
    return response;
  }

  async findAllUsers(
    query: AdminUsersQuery,
    userRole?: USER_ROLE,
  ): Promise<
    ApiModel.PaginatedResponse<UserListAdminResponseDTO | UserAdminResponseDTO>
  > {
    let result: ApiModel.PaginatedResponse<UserEntity>;
    const data: (UserListAdminResponseDTO | UserAdminResponseDTO)[] = [];

    if (userRole && userRole === USER_ROLE.ADMIN) {
      result = await this._userRepositoryService.findAllUsersForAdmin(
        query,
        userRole,
      );

      for await (const el of result.data) {
        const user = new UserAdminResponseDTO(el);
        data.push(user);
      }
    } else {
      result = await this._userRepositoryService.findAllUsersForAdmin(query);

      for await (const el of result.data) {
        const user = new UserListAdminResponseDTO(el);
        data.push(user);
      }
    }

    return {
      ...result,
      data,
    };
  }

  async getUserDetails(userId: string): Promise<UserDetailsAdminResponseDTO> {
    try {
      const user: UserEntity =
        await this._userRepositoryService.findUserProfileById(userId, null,);

      if (!user) {
        throw new NotFoundException({ key: 'validation.USER_NOT_FOUND' });
      }

      return new UserDetailsAdminResponseDTO(user);
    } catch (error) {
      handleError(error);
    }
  }


}
