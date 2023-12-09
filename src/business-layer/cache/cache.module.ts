import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { TTL_CONSTANTS } from './constants/ttl.constants';

@Module({
  providers: [CacheService],
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: TTL_CONSTANTS.ONE_DAY,
      max: 100,
    }),
  ],
  exports: [CacheService],
})
export class CustomCacheModule {}
