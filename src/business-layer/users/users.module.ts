import { Module } from '@nestjs/common';

import { FileEntityModule } from '../../data-access-layer/file-entity/file-entity.module';
import { UserEntityModule } from '../../data-access-layer/user-entity/user-entity.module';
import { CdnModule } from '../cdn/cdn.module';
import { MyMailerModule } from '../mailer/mailer.module';
import { AdminsController } from './controllers/admin/admin.controller';
import { UsersController } from './controllers/users.controller';
import { AdminService } from './services/admin/admin.service';
import { UserHelpersService } from './services/user-helpers.service';
import { UserService } from './services/user.service';
@Module({
  controllers: [UsersController, AdminsController],
  providers: [UserService, AdminService, UserHelpersService],
  imports: [
    UserEntityModule,
    FileEntityModule,
    CdnModule,

    MyMailerModule,
    FileEntityModule,
  ],
  exports: [UserHelpersService, UserService, UserEntityModule, AdminService],
})
export class UsersModule {}
