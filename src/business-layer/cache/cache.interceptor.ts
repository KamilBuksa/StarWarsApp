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
    const pageParam = request.query.page;
    const isPageWithinLimit =
      pageParam && !isNaN(pageParam) && Number(pageParam) <= 3;
    const hasSearchParam = 'query' in request.query;

    if (hasSearchParam || !isPageWithinLimit) {
      //en: If the request contains the 'search' parameter or the 'page' parameter is greater than 5,
      // do not return the cache key, which will cause the data to not be cached.
      return undefined;
    }

    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (cacheKey) {
      return `${cacheKey}-${request._parsedUrl.query}`;
    }
    return super.trackBy(context);
  }
}