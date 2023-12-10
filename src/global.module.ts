import { Global, Module } from '@nestjs/common';
import { CustomCacheModule } from './business-layer/cache/cache.module';
import { HttpModule } from '@nestjs/axios';
import { UserEntityModule } from './data-access-layer/user-entity/user-entity.module';

@Global()
@Module({
  imports: [CustomCacheModule, HttpModule, UserEntityModule],
  exports: [CustomCacheModule, HttpModule, UserEntityModule],
})
export class GlobalModule {}
