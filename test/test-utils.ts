import { JwtService } from '@nestjs/jwt';

import request from 'supertest';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { jwtConfig } from '../src/business-layer/auth/config/jwt.config';
import { UserEntity } from '../src/data-access-layer/user-entity/entities/user.entity';
import { USER_ROLE } from '../src/data-access-layer/user-entity/entities/enums/user.roles';
import { USER_STATUS } from '../src/data-access-layer/user-entity/entities/enums/user.status';
import { LanguageModel } from '../src/business-layer/i18n/model/language.model';
import { USER_GENDER } from '../src/data-access-layer/user-entity/entities/enums/user.gender';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();

const testUrl = 'http://localhost:3000/api';
const configService = new ConfigService();

export function req(config: {
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}) {
  if (config.method === 'GET') {
    return request(testUrl)
      .get(config.route)
      .set('accept-language', 'en')
      .set('content-language', 'en')
      .set('content-type', 'application/json');
  }
  if (config.method === 'POST') {
    return request(testUrl)
      .post(config.route)
      .set('accept-language', 'en')
      .set('content-language', 'en')
      .set('content-type', 'application/json');
  }
  if (config.method === 'PUT') {
    return request(testUrl)
      .put(config.route)
      .set('accept-language', 'en')
      .set('content-language', 'en')
      .set('content-type', 'application/json');
  }
  if (config.method === 'DELETE') {
    return request(testUrl)
      .delete(config.route)
      .set('accept-language', 'en')
      .set('content-language', 'en')
      .set('content-type', 'application/json');
  }
  if (config.method === 'PATCH') {
    return request(testUrl)
      .patch(config.route)
      .set('accept-language', 'en')
      .set('content-language', 'en')
      .set('content-type', 'application/json');
  }
  throw new Error('Test method not implemented');
}

export function getToken(payload: UserEntity) {
  const s = new JwtService();
  const SECRET = jwtConfig.secret;
  const token = s.sign(
    {
      token_data: payload
    },
    {
      secret: SECRET,
      expiresIn: jwtConfig.signOptions.expiresIn,
    },
  );

  return 'Bearer ' + token;
}

export function getTestDataSource() {
  const ds = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'edek',
    password: 'root',
    database: 'starWars',
    entities: ['*/**/*.entity.ts'],
    namingStrategy: new SnakeNamingStrategy(),
  });
  return ds;
}

export async function clearDB(ds: DataSource) {
  const metadata = ds.entityMetadatas;
  const qRunner = ds.createQueryRunner();
  await qRunner.startTransaction();
  await qRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
  for (const ent of metadata) {
    await qRunner.query(`TRUNCATE \`${ent.tableName}\`;`);
  }

  await qRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

  await qRunner.commitTransaction();
  await qRunner.release();
}

export function getTestUser(data: {
  id?: string;
  surname?: string;
  name?: string;
  role?: USER_ROLE;
  login?: string;
}) {
  const user = new UserEntity();
  if (data.id) {
    user.id = data.id;
  }
  user.email = data.login || 'lukeSkywalker@gmail.com';
  user.password = '123456789';
  user.isAccountVerified = true;
  user.status = USER_STATUS.ACTIVATED;
  user.role = data.role || USER_ROLE.USER;
  user.surname = data.surname || 'Skywalker';
  user.name = data.name || 'Luke';
  user.lang = LanguageModel.DEFAULT_LANGUAGE;
  user.gender = USER_GENDER.MALE

  return user;
}
