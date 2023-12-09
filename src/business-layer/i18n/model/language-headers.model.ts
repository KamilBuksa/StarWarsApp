import {
  applyDecorators,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { LanguageModel } from './language.model';

export namespace LanguageHeadersModel {
  export enum HEADERS {
    ACCEPT_LANGUAGE_HEADER_KEY = 'Accept-language',
    CONTENT_LANGUAGE_HEADER_KEY = 'Content-language',
  }

  export type RequestWithLanguageHeaders = {
    requestLanguage: LanguageModel.LANGUAGE;
    responseLanguage: LanguageModel.LANGUAGE;
  } & ExpressRequest;

  export const languageApiDecorators: Array<MethodDecorator & ClassDecorator> =
    [
      ApiHeader({
        name: HEADERS.ACCEPT_LANGUAGE_HEADER_KEY,
        description: 'Expected response language',
        allowEmptyValue: false,
        required: true,
        enum: LanguageModel.LANGUAGE,
        schema: {
          example: 'pl',
        },
      }),
      ApiHeader({
        name: HEADERS.CONTENT_LANGUAGE_HEADER_KEY,
        description: 'Expected request language',
        allowEmptyValue: false,
        required: true,
        enum: LanguageModel.LANGUAGE,
        schema: {
          example: 'pl',
        },
      }),
    ];

  export function LanguageHeadersGuardDecorator() {
    return applyDecorators(...languageApiDecorators, UseGuards(new Guard()));
  }

  @Injectable()
  export class Guard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: RequestWithLanguageHeaders = context
        .switchToHttp()
        .getRequest();

      const acceptHeader: string | undefined = request.header(
        HEADERS.ACCEPT_LANGUAGE_HEADER_KEY,
      ) as string | undefined;

      const options = `Available options: ${Object.values(
        LanguageModel.LANGUAGE,
      )}`;

      if (!acceptHeader) {
        throw new BadRequestException(
          `${HEADERS.ACCEPT_LANGUAGE_HEADER_KEY} header is missing! ${options}`,
        );
      }

      if (!isValidLanguageCode(acceptHeader)) {
        throw new BadRequestException(
          `${HEADERS.ACCEPT_LANGUAGE_HEADER_KEY} header value is invalid! ${options}`,
        );
      }

      const contentHeader: string | undefined = request.header(
        HEADERS.CONTENT_LANGUAGE_HEADER_KEY,
      ) as string | undefined;

      if (!contentHeader) {
        throw new BadRequestException(
          `${HEADERS.CONTENT_LANGUAGE_HEADER_KEY} header is missing! ${options}`,
        );
      }

      if (!isValidLanguageCode(contentHeader)) {
        throw new BadRequestException(
          `${HEADERS.CONTENT_LANGUAGE_HEADER_KEY} header value is invalid! ${options}`,
        );
      }

      request.requestLanguage = contentHeader as LanguageModel.LANGUAGE;
      request.responseLanguage = acceptHeader as LanguageModel.LANGUAGE;
      return true;
    }
  }

  export function isValidLanguageCode(languageCode: string): boolean {
    const availableLanguages: LanguageModel.LANGUAGE[] = Object.values(
      LanguageModel.LANGUAGE,
    );
    return availableLanguages.includes(languageCode as LanguageModel.LANGUAGE);
  }

  export function getRequestLanguages(request: Request): {
    requestLanguage: LanguageModel.LANGUAGE;
    responseLanguage: LanguageModel.LANGUAGE;
  } {
    return {
      responseLanguage: request.headers.get(
        HEADERS.ACCEPT_LANGUAGE_HEADER_KEY,
      ) as LanguageModel.LANGUAGE,
      requestLanguage: request.headers.get(
        HEADERS.CONTENT_LANGUAGE_HEADER_KEY,
      ) as LanguageModel.LANGUAGE,
    };
  }
}
