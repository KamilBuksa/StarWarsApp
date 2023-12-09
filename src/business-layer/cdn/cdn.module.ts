import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CdnController } from './controllers/cdn/cdn.controller';
import { CdnService } from './services/cdn/cdn.service';
import { FileEntityModule } from '../../data-access-layer/file-entity/file-entity.module';
import { UserEntityModule } from '../../data-access-layer/user-entity/user-entity.module';
import { PassportAnonymousStrategy } from '../../strategies/anonymous.strategy';
import { CdnHelpersService } from './services/cdn/cdn-helpers.service';
import { SharpCompressionWorkerHost } from './workers/sharp-compression-worker.host';
import { CdnWorkerService } from './workers/cdn-workers.service';
import { ConvertToJpgWorkerHost } from './workers/convert-to-jpg-worker.host';

@Module({
  imports: [MulterModule, FileEntityModule, UserEntityModule],
  controllers: [CdnController],
  providers: [
    CdnService,
    PassportAnonymousStrategy,
    CdnHelpersService,
    SharpCompressionWorkerHost,
    CdnWorkerService,
    ConvertToJpgWorkerHost,
  ],
  exports: [CdnHelpersService],
})
export class CdnModule {}
