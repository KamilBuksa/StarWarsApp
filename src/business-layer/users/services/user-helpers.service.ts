import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';

import { I18nService } from 'nestjs-i18n';
import * as randomstring from 'randomstring';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { USER_STATUS } from '../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../generated/i18n.generated';
import { handleError } from '../../../utils/other.utils';
import { PasswordsUtils } from '../../../utils/passwords.utilts';
import { RegisterUserDTO } from '../../auth/dtos/request/register.user.dto';
import { ValidateRegisterUserInterface } from '../user.types';

@Injectable()
export class UserHelpersService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _i18nService: I18nService,
  ) {}

  async createUserEntity(data: RegisterUserDTO): Promise<[UserEntity]> {
    const newUser = await this._userRepositoryService.create({
      status: USER_STATUS.ACTIVATED,
      email: data.email.toLowerCase(),
      password: data.password
        ? await PasswordsUtils.hashPassword(data.password)
        : null,
      role: USER_ROLE.USER,
      lastActivityDate: new Date(),
      lang: data.lang,
      name: data.name,
      surname: data.surname,
      gender: data.gender,
    });

    const user = await this._userRepositoryService.save(newUser);

    return [user];
  }

  async saveUserEntity(userEntity: UserEntity): Promise<UserEntity> {
    return await this._userRepositoryService.save(userEntity);
  }

  async validateUser(data: ValidateRegisterUserInterface): Promise<boolean> {
    let user: undefined | UserEntity;

    if (data.email) {
      user = await this._userRepositoryService.findOneBy(
        { email: data.email },
        { skipStatus: true },
      );
      if (user)
        throw new ForbiddenException({
          key: 'validation.EMAIL_IS_BUSY',
        } as { key: I18nPath });
    }
    return true;
  }

  async updateLastActivity(userEntity: UserEntity) {
    await this._userRepositoryService.update(userEntity.id, {
      lastActivityDate: moment().format(),
    });
  }

  async updateUser(id: string, data: QueryDeepPartialEntity<UserEntity>) {
    await this._userRepositoryService.update(id, data);
  }

  async updateManyUsers(
    ids: string[],
    data: QueryDeepPartialEntity<UserEntity>,
  ) {
    await this._userRepositoryService.updateMany(ids, data, UserEntity);
  }

  async generateToken(): Promise<string> {
    try {
      let token: undefined | string = randomstring.generate({
        length: 64,
        charset: 'alphanumeric',
      });
      const findUserByToken =
        await this._userRepositoryService.findOneByRemindToken(token);

      if (findUserByToken) {
        token = randomstring.generate({
          length: 64,
          charset: 'alphanumeric',
        });
      }

      return token;
    } catch (error) {
      handleError(error);
    }
  }

  async findAdnValidateUserByEmail(email: string): Promise<UserEntity> {
    try {
      if (email) {
        const user: UserEntity = await this.findByEmail(email);
        if (user)
          throw new ForbiddenException({
            key: 'validation.EMAIL_IS_BUSY',
          } as { key: I18nPath });

        return user;
      }
    } catch (error) {
      handleError(error);
    }
  }

  async findByEmail(
    email: string,
    options?: { throwError: boolean },
  ): Promise<UserEntity> {
    try {
      if (email) {
        const user = await this._userRepositoryService.findOneBy(
          { email },
          { skipStatus: true },
        );

        if (!user && options?.throwError) {
          throw new NotFoundException({
            key: 'validation.USER_NOT_FOUND',
          } as { key: I18nPath });
        }
        return user;
      }
    } catch (error) {
      handleError(error);
    }
  }
}
