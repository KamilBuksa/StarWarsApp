import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileRepositoryService } from './services/file-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileRepositoryService],
  exports: [FileRepositoryService],
})
export class FileEntityModule {}
