import { Global, Module } from '@nestjs/common';
import { CustomCacheModule } from './business-layer/cache/cache.module';

@Global()
@Module({
  imports: [CustomCacheModule],
  exports: [CustomCacheModule],
})
export class GlobalModule {}
