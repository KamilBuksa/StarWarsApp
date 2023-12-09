import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUsersQuery } from '../../../business-layer/users/dtos/request/get.user.dto';
import { ApiModel } from '../../../models/api.model';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { USER_ROLE } from '../entities/enums/user.roles';
import { USER_STATUS } from '../entities/enums/user.status';
import { UserEntity } from '../entities/user.entity';
import { EntityKeys } from '../../../utils/types/entity-keys.type';

import { isArray } from '../../../utils/other.utils';
import { DefaultSelectFields } from 'src/data-access-layer/repository-service-select-fields';

export class UserRepositoryService extends AbstractCrudRepositoryService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {
    super(_userRepository);
  }

  async findOneById(
    id: string,
  ): Promise<UserEntity> {
    let query = this._userRepository.createQueryBuilder('user');

    query = query.where('user.id = :id AND user.status = :status', {
      id: id,
      status: USER_STATUS.ACTIVATED,
    });

    const user: UserEntity | undefined = await query.getOne();
    return user;
  }





  async findOneByActivateAccountToken(
    token: string,
  ): Promise<UserEntity | undefined> {
    let query = this._userRepository
      .createQueryBuilder('user')
    query = query.where(
      'user.activateAccountToken = :token AND (user.isAccountVerified <> :isAccountVerified OR user.isAccountVerified IS NULL)',
      {
        token,
        isAccountVerified: true,
      },
    );

    const user: UserEntity | undefined = await query.getOne();
    return user;
  }
  async findOneByRemindToken(token: string): Promise<UserEntity> {
    let query = this._userRepository.createQueryBuilder('user');

    query = query.where('user.remindPasswordToken = :token', {
      token,
    });

    const user: UserEntity | undefined = await query.getOne();
    return user;
  }

  async findOneBy(
    keys: {
      id?: string;
      email?: string;

      remindPasswordToken?: string;
    },
    options?: {
      withPassword?: boolean;
      skipStatus?: boolean;
      select?: EntityKeys<UserEntity>;
    },
  ): Promise<UserEntity> {
    let query = this._userRepository.createQueryBuilder('user');

    if (options?.skipStatus) {
    } else {
      query = query.where('user.status = :status', {
        status: USER_STATUS.ACTIVATED,
      });
    }
    if (keys.id) {
      query = query.andWhere('user.id = :id', {
        id: keys?.id,
      });
    }

    if (keys.email) {
      query = query.andWhere('user.email = :email', {
        email: keys?.email.toLowerCase(),
      });
    }

    if (keys.remindPasswordToken) {
      query = query.andWhere(
        'user.remindPasswordToken = :remindPasswordToken',
        {
          remindPasswordToken: keys?.remindPasswordToken,
        },
      );
    }

    if (!keys) return null;
    if (options?.select) {
      query = query.select(options.select.map((el) => `user.${el}`));
    } else {
      query.select(DefaultSelectFields.extendedUserSelectFields);
    }

    if (options?.withPassword) query.addSelect(['user.password']);
    const user: UserEntity | undefined = await query.getOne();
    return user;
  }




  async findOneByIdPure(
    userId: string,
    options?: { select: EntityKeys<UserEntity> },
  ): Promise<UserEntity> {
    let query = this._userRepository.createQueryBuilder('user');
    query = query
      .where('user.id = :userId', {
        userId,
      })



    if (options?.select) {
      query = query.select(options.select.map((el) => `user.${el}`));
    }


    const user: UserEntity | undefined = await query
      .getOne();
    return user;
  }

  async findUsersForRemove(date?: Date): Promise<UserEntity[]> {
    const query = this._userRepository
      .createQueryBuilder('user')
      .where('user.status = :status AND user.firstLogin = :val', {
        status: USER_STATUS.WAITING_FOR_ACCEPTANCE,
        val: true,
      })

      .andWhere(':date > user.createdAt', { date });
    const sockets: UserEntity[] | undefined = await query
      .select(['user.id', 'user.firstLogin'])
      .getMany();

    return sockets;
  }

  async findAdmin(): Promise<UserEntity> {
    const admin = await this._userRepository.findOne({
      where: { role: USER_ROLE.ADMIN },
    });
    return admin;
  }
  async findAdmins(): Promise<UserEntity[]> {
    const admin = await this._userRepository.find({
      where: { role: USER_ROLE.ADMIN, status: USER_STATUS.ACTIVATED },
      withDeleted: false,
    });
    return admin;
  }

  async findAllUsersForAdmin(
    filterData: AdminUsersQuery,
    userRole?: USER_ROLE,
  ): Promise<ApiModel.PaginatedResponse<UserEntity>> {
    let query = this._userRepository
      .createQueryBuilder('user')

      .where('user.role = :userRole', {
        userRole: userRole ? userRole : USER_ROLE.USER,
      });

    if (filterData.query) {
      query = query.andWhere(
        '((user.name LIKE :query) OR (user.surname LIKE :query) OR (user.email LIKE :query) OR (CONCAT(user.name, " ", user.surname) LIKE :query))',
        {
          query: `%${filterData.query}%`,
        },
      );
    }
    if (isArray(filterData.statuses)) {
      query = query.andWhere('user.status IN (:...statuses)', {
        statuses: filterData.statuses,
      });
    }

    const [data, totalCount]: [UserEntity[], number] = await query
      .select(DefaultSelectFields.extendedUserSelectFields)

      .skip((filterData.page - 1) * filterData.limit)
      .orderBy('user.createdAt', 'DESC')
      .take(filterData.limit)
      .getManyAndCount();

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }

  async findUserProfileById(
    userId: string,
    options?: { select?: EntityKeys<UserEntity>; withPassword?: boolean },

  ): Promise<UserEntity> {
    let query = this._userRepository
      .createQueryBuilder('user')


    query.where('user.id = :userId', {
      userId,
    });

    if (options?.select) {
      query = query.select(options.select.map((el) => `user.${el}`));
    }
    if (options?.withPassword) query.addSelect(['user.password']);

    return await query.getOne();
  }

  async findCurrentUser(
    userId: string,
    options?: {
      select?: EntityKeys<UserEntity>;
      withPassword?: boolean;
      role?: USER_ROLE;
    },
  ): Promise<UserEntity> {
    let query = this._userRepository
      .createQueryBuilder('user')

    query.where('user.id = :userId', {
      userId,
    });

    if (options?.select) {
      query = query.select(options.select.map((el) => `user.${el}`));
    }

    return await query.getOne();
  }
  async getAllUsersWithoutAdmins(): Promise<UserEntity[]> {
    const query = this._userRepository.createQueryBuilder('user');

    query
      .where('user.status = :status', { status: USER_STATUS.ACTIVATED })
      .andWhere('user.role <> :role', { role: USER_ROLE.ADMIN });

    const users: UserEntity[] = await query.getMany();
    return users;
  }

  async getUsersByIds(usersIds: string[]): Promise<UserEntity[]> {
    const query = this._userRepository.createQueryBuilder('user');

    query.where('user.id IN (:...usersIds)', { usersIds });
    return await query.getMany();
  }

  async getUserLanguage(userId: string): Promise<UserEntity> {
    const query = this._userRepository.createQueryBuilder('user');

    query
      .select(['user.id', 'user.lang'])
      .where('user.id = :userId', { userId });

    const user: UserEntity = await query.getOne();
    return user;
  }
}
