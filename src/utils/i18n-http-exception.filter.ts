import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  ValidationError,
} from '@nestjs/common';
import {
  I18nContext,
  I18nValidationError,
  I18nValidationException,
} from 'nestjs-i18n';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n/dist/interfaces/i18n-validation-exception-filter.interface';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';
import { ApiModel } from '../models/api.model';

type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current();
    if (exception instanceof I18nValidationException) {
      const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
        lang: i18n.lang,
      });
      switch (host.getType() as string) {
        case 'http': {
          const response = host.switchToHttp().getResponse();

          response.status(exception.getStatus()).json({
            fields: new ApiModel.ValidationDTOError(errors).getResponse(),
            statusCode: exception.getStatus(),
            error: exception.message,
          });
          break;
        }
      }
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      let message = exception.message;

      if (exception.getResponse()['key']) {
        const messages = exception.getResponse() as {
          key: string;
          args: Record<string, any>;
        };

        message = await i18n.translate(messages.key, {
          lang: i18n.lang,
          args: messages.args,
        });

        response
          .status(this.options.errorHttpStatusCode || exception.getStatus())
          .send({
            statusCode: exception.getStatus(),
            message: message,
            error: exception.message,
          });
      } else {
        response
          .status(this.options.errorHttpStatusCode || exception.getStatus())
          .send(exception.getResponse());
      }
    }
  }

  private isWithErrorFormatter(
    options: I18nValidationExceptionFilterOptions,
  ): options is I18nValidationExceptionFilterErrorFormatterOption {
    return 'errorFormatter' in options;
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    if (
      this.isWithErrorFormatter(this.options) &&
      !('detailedErrors' in this.options)
    )
      return this.options.errorFormatter(validationErrors);

    if (
      !this.isWithErrorFormatter(this.options) &&
      !this.options.detailedErrors
    )
      return;
    return new ApiModel.ValidationDTOError(validationErrors);
  }
}
