import {
  CallHandler,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
  NestInterceptor,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { LanguageModel } from '../business-layer/i18n/model/language.model';

@Injectable()
export class ValidOneSmsPerMinuteInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, number>();
  constructor(private readonly _i18nService: I18nService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    if (user) {
      const key = user.id; // key for cache memory
      const currentTime = Date.now();
      const lastRequestTime = this.cache.get(key) || 0;
      const timeDiff = currentTime - lastRequestTime;
      const cooldownPeriod = 60000; // waiting time - 1 minute
      if (timeDiff < cooldownPeriod) {
        throw new MethodNotAllowedException(
          `${this._i18nService.translate(
            'validation.PHONE_NUMBER_CODE_NOT_AVAILABLE_YET',
            {
              lang:
                req?.headers['accept-language'] ||
                user.lang ||
                LanguageModel.DEFAULT_LANGUAGE,
            },
          )}`,
        );
      }
      this.cache.set(key, currentTime);
    }
    return next.handle();
  }
}
