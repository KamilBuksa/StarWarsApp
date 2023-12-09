import { Injectable, NotFoundException } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { USER_STATUS } from '../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../generated/i18n.generated';
import { ApiModel } from '../../../models/api.model';
import { GenerateRandomUtils } from '../../../utils/generateRandom.utils';
import { handleError } from '../../../utils/other.utils';
import { MailService } from '../../mailer/services/mailer.service';
import { UpdateUserDTO } from '../dtos/request/update.user.dto';
import { CurrentUserResponseDTO } from '../dtos/response/user.res.dto';
import {
  UserUpdateAdminResponseDTO,
  UserUpdateResponseDTO,
} from '../dtos/response/user.update.res.dto';
import { UserHelpersService } from './user-helpers.service';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _dataSource: DataSource,
    private readonly _mailService: MailService,
    private readonly _userHelpersService: UserHelpersService,
  ) {}

  async updateProfile(
    data: UpdateUserDTO,
    currentUser: UserEntity,
    userIdForAdmin?: string,
  ): Promise<UserUpdateResponseDTO | UserUpdateAdminResponseDTO> {
    const { ...dataForUpdateUser } = data;

    let userEntity: UserEntity = currentUser;
    if (userEntity.role === USER_ROLE.ADMIN && userIdForAdmin) {
      userEntity = await this._userRepositoryService.findUserProfileById(
        userIdForAdmin,
        null,
      );
    }
    if (!userEntity)
      throw new NotFoundException({ key: 'validation.USER_NOT_FOUND' } as {
        key: I18nPath;
      });

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(UserEntity, userEntity.id, {
        ...dataForUpdateUser,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction().catch(() => {
        handleError(err);
      });
      handleError(err);
    } finally {
      await queryRunner.release();
    }

    const responseUser = await this._userRepositoryService.findUserProfileById(
      userEntity.id,
      undefined,
    );

    return currentUser.role === USER_ROLE.ADMIN && userIdForAdmin
      ? new UserUpdateAdminResponseDTO(responseUser)
      : new UserUpdateResponseDTO(responseUser);
  }
  async deleteMyProfile(user: UserEntity): Promise<ApiModel.StatusResponse> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findUserDataForDelete =
        await this._userRepositoryService.findUserProfileById(user.id);
      const generateRandomString: string =
        GenerateRandomUtils.generateRandomString(6);

      await queryRunner.manager.update(UserEntity, findUserDataForDelete.id, {
        status: USER_STATUS.DELETED,
        email: generateRandomString,
        name: generateRandomString,
        surname: generateRandomString,
        password: generateRandomString,
      });
      await queryRunner.manager.softDelete(UserEntity, {
        id: user.id,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      handleError(err);
    } finally {
      await queryRunner.release();
      return { status: true };
    }
  }

  async getCurrentUser(
    userEntity: UserEntity,
  ): Promise<CurrentUserResponseDTO> {
    try {
      const user: UserEntity | undefined =
        await this._userRepositoryService.findCurrentUser(userEntity.id, {
          select: [
            'id',
            'role',
            'status',
            'name',
            'surname',
            'email',
            'lang',
            'isAccountVerified',

            'gender',
          ],
          role: userEntity.role,
        });

      if (!user)
        throw new NotFoundException({ key: 'validation.USER_NOT_FOUND' } as {
          key: I18nPath;
        });

      const response = new CurrentUserResponseDTO(user);
      return response;
    } catch (error) {
      handleError(error);
    }
  }
}
