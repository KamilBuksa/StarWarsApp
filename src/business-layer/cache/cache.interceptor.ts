import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  CACHE_KEY_METADATA,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const hasSearchParam = 'query' in request.query;
    const hasSearchParam2 = 'search' in request.query;

    // uncoment this to disable caching for search and query
    // if (hasSearchParam || hasSearchParam2) {
    //   console.log('do not cache');
    //   return undefined;
    // }

    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    const { id } = request.params;

    if (id) {
      return `${cacheKey}-${id}`;
    }

    if (cacheKey) {
      return `${cacheKey}-${request._parsedUrl.query}`;
    }
    return super.trackBy(context);
  }
}
