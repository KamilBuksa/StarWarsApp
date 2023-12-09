import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepositoryService } from './providers/user.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,])],
  providers: [UserRepositoryService,],
  exports: [UserRepositoryService,],
})
export class UserEntityModule { }
