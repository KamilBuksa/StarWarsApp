import { applyDecorators, InternalServerErrorException } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Column, ColumnOptions, FindOperator, Like } from 'typeorm';

export namespace LanguageModel {
  export enum LANGUAGE {
    EN = 'en',
    PL = 'pl',
  }
  export class RawTranslationsDTO {
    en?: string;
    pl?: string;
  }

  export class TranslationDTO {
    @IsNotEmpty({
      message: i18nValidationMessage('validation.BODY_VALIDATION.NOT_EMPTY'),
    })
    @IsString({
      message: i18nValidationMessage('validation.BODY_VALIDATION.IS_STRING'),
    })
    en: string;

    @IsNotEmpty({
      message: i18nValidationMessage('validation.BODY_VALIDATION.NOT_EMPTY'),
    })
    @IsString({
      message: i18nValidationMessage('validation.BODY_VALIDATION.IS_STRING'),
    })
    pl: string;
  }

  // for search query
  export const I18nLikeString = (query: string, language: LANGUAGE) =>
    `%"${language}":"%${query}%"%`;

  export const I18nLikeStringOnly = (query: string) => `%"%${query}%"%`;

  // for filters
  export const I18nEqualsString = (query: string, language: LANGUAGE) =>
    `%"${language}":"${query}"%`;

  export const I18nLike = (query: string, language: LANGUAGE) =>
    Like(I18nLikeString(query, language));

  export const DEFAULT_LANGUAGE = LANGUAGE.EN;

  export type I18nPropertyRaw = { [key in LanguageModel.LANGUAGE]?: string };

  export class I18nProperty {
    constructor(private _data: { [key in LANGUAGE]?: string } = {}) {}

    // override JS toString method
    toString(): string {
      return this._data[DEFAULT_LANGUAGE] ?? '';
    }

    getTranslation(language: LanguageModel.LANGUAGE | any): string | undefined {
      return this._data[language]
        ? this._data[language]
        : this._data[process.env.DEFAULT_APP_LANGUAGE];
    }

    setTranslation(language: LanguageModel.LANGUAGE, value: string): void {
      this._data[language] = value;
    }

    forgetTranslation(language: LanguageModel.LANGUAGE): void {
      delete this._data[language];
    }

    toDataBaseString(): string {
      return JSON.stringify(this._data);
    }

    getRawData(): RawTranslationsDTO {
      return this._data;
    }
  }

  export type I18nPropertyNames<T> = {
    [K in keyof T]: T[K] extends I18nProperty ? K : never;
  }[keyof T];

  export class I18nException extends InternalServerErrorException {
    constructor(message?: string) {
      super(message);
    }
  }

  export function LanguageColumn(options?: ColumnOptions) {
    return applyDecorators(
      Column({
        type: 'text',
        ...options,
        transformer: {
          // reading from DB
          from: (value: string) => {
            try {
              const parsedData: { [key in LANGUAGE]?: string } =
                JSON.parse(value);
              return new I18nProperty(
                typeof parsedData === 'object' ? parsedData : {},
              );
            } catch (error) {
              return new I18nProperty();
            }
          },

          // writing to DB
          to: (value: I18nProperty | FindOperator<any>) => {
            return value instanceof I18nProperty
              ? value.toDataBaseString()
              : value;
          },
        },
      }),
    );
  }
}
