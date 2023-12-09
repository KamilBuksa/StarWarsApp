/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidationError,
} from 'class-validator';
import { Request } from 'express';
import { LanguageModel } from '../business-layer/i18n/model/language.model';
import { UserEntity } from '../data-access-layer/user-entity/entities/user.entity';
import { MailingDataDTO, MailingDataRes } from '../utils/dtos/mailing-data.dto';
import { isArray } from '../utils/other.utils';

export namespace ApiModel {
  export type RequestWithLanguageHeaders = {
    requestLanguage: LanguageModel.LANGUAGE;
    responseLanguage: LanguageModel.LANGUAGE;
  } & Request;

  export const PAGINATION_BASE_PAGE = 1;
  export const PAGINATION_BASE_LIMIT = 10;
  export class PaginationQuery {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = PAGINATION_BASE_PAGE;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = PAGINATION_BASE_LIMIT;

    @IsOptional()
    @IsString()
    sort_by?: string | undefined;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    query?: string | undefined;
  }


  export class PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }

  export class PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
  }

  export class StatusResponse {
    status: boolean;
    message?: string;
    params?: string;

    constructor(data: { status: boolean; message?: string; params?: any }) {
      this.status = data.status;
      this.message = data.message;
      this.params = data.params;
    }
  }

  export class StatusResponseMailingData {
    status: boolean;
    message?: string;
    mailingData: MailingDataDTO[];

    constructor(data: {
      status: boolean;
      message?: string;
      mailingData: MailingDataRes[];
    }) {
      this.status = data.status;
      this.message = data.message;
      if (isArray(data.mailingData)) {
        this.mailingData = data.mailingData;
      }
    }
  }

  export enum ACTION_TYPE {
    ACCEPT = 'ACCEPT',
    CANCEL = 'CANCEL',
  }

  export class OneParamDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }

  export type ApiFieldError = {
    [key: string]: string[];
  };

  export type RequestWithUser = {
    user: UserEntity;
  } & Request;


  export const emptyResponse = () => {
    return {
      data: [],
      meta: {
        current_page: 0,
        last_page: 0,
        per_page: 0,
        total: 0,
      },
    };
  };

  export const getOffset = (pageNumber: number, onPage: number) => {
    if (pageNumber <= 1) {
      return 0;
    } else {
      return (pageNumber - 1) * onPage;
    }
  };

  export class ValidationDTOError extends HttpException {
    constructor(errors: ValidationError[]) {
      super(
        {
          fields:
            ValidationDTOError._mapValidationErrorsToApiFieldError(errors),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    private static _mapValidationErrorsToApiFieldError(
      errors: ValidationError[],
    ): ApiFieldError {
      let fieldError: ApiFieldError = {};

      errors.forEach((error: ValidationError) => {
        fieldError = {
          ...fieldError,
          ...this._getErrors(error),
        };
      });

      return fieldError;
    }

    private static _getErrors(error: ValidationError): ApiFieldError {
      const result: ApiFieldError = {};

      // gets validation errors from childrens
      error.children.forEach((childrenError: ValidationError) => {
        this._getNestedValidationErrors(result, childrenError, error.property);
      });

      this._generateTopLevelConstrains(error, error.property, result);

      return result;
    }

    private static _getNestedValidationErrors(
      fieldError: ApiFieldError,
      error: ValidationError,
      parent_property_path: string,
    ): void {
      if (error.children?.length > 0) {
        error.children?.forEach((_err) =>
          this._getNestedValidationErrors(
            fieldError,
            _err,
            `${parent_property_path}.${error.property}`,
          ),
        );
      }

      this._generateTopLevelConstrains(
        error,
        `${parent_property_path}.${error.property}`,
        fieldError,
      );
    }

    private static _generateTopLevelConstrains(
      error: ValidationError,
      property: string,
      fieldError: ApiFieldError,
    ): void {
      if (error.constraints) {
        if (!fieldError[`${property}`]) {
          fieldError[`${property}`] = [];
        }

        Object.keys(error.constraints).forEach((key: string) => {
          fieldError[`${property}`].push(error.constraints[key]);
        });
      }
    }
  }
}
