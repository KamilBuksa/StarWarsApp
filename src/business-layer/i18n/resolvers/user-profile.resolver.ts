import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { jwtConfig } from '../../auth/config/jwt.config';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';

@Injectable()
export class UserProfileResolver implements I18nResolver {
  constructor(private readonly dataSource: DataSource) {}
  async resolve(context: ExecutionContext): Promise<string | undefined> {
    const authorization = context.switchToHttp().getRequest<Request>()
      .headers.authorization;
    if (authorization) {
      try {
        const decoded = await jwt.verify(
          authorization.split(' ')[1],
          jwtConfig.secret,
        );
        if (decoded && decoded['token_data']) {
          const userEntity = await this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.id = :id', {
              id: decoded['token_data']['id'],
            })
            .getOne();

          const lang: string = userEntity.lang;
          return lang.toLocaleLowerCase();
        }
      } catch (e) {}
    }
  }
}
