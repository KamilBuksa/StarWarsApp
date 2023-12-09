/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { CDNModel } from '../business-layer/cdn/models/cdn.model';
import { LanguageModel } from '../business-layer/i18n/model/language.model';
import { convertToArray, isArray } from '../utils/other.utils';
import { ApiModel } from './api.model';

export namespace ApiSwaggerModel {
  export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
  ) =>
    applyDecorators(
      ApiExtraModels(ApiModel.PaginationMeta, dataDto),
      ApiOkResponse({
        status: 200,
        description: 'Successfully',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(dataDto),
              },
            },
            meta: {
              type: 'object',
              $ref: getSchemaPath(ApiModel.PaginationMeta),
            },
          },
        },
      }),
    );

  export const ApiPropertyLanguage = () =>
    applyDecorators(
      ApiExtraModels(LanguageModel.RawTranslationsDTO),
      ApiProperty({
        oneOf: [
          {
            type: 'object',
            $ref: getSchemaPath(LanguageModel.RawTranslationsDTO),
          },
          { type: 'string' },
        ],
      }),
    );

  export const ApiFileCustom = () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiConsumes('multipart/form-data'),
      ApiOperation({
        description: 'CDN - upload file',
        summary: 'Upload file',
      }),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      }),
      ApiResponse({
        type: CDNModel.UploadedFileResponse,
        status: HttpStatus.CREATED,
      }),
    );

  export const ApiResponseWithExtraModule = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
  ) =>
    applyDecorators(
      ApiExtraModels(dataDto),
      ApiResponse({
        status: 200,
        schema: {
          $ref: getSchemaPath(dataDto),
        },
      }),
    );

  export const ApiStringToArray = (myEnum?: any, isNotEmpty?: boolean) =>
    applyDecorators(
      isNotEmpty ? IsNotEmpty() : IsOptional(),
      ApiProperty(
        !isArray(myEnum)
          ? { type: String }
          : { enum: myEnum, isArray: true, type: String, example: myEnum },
      ),
      !isArray(myEnum)
        ? IsUUID('4', { each: true })
        : IsEnum(myEnum, {
            each: true,
            message: `Available options: ${myEnum} `,
          }),
      ArrayUnique(),
      Transform(({ value }) => convertToArray(value)),
    );

  export const ApiEnum = (enumsToUse: any[]) =>
    applyDecorators(
      IsNotEmpty(),
      ApiProperty({ enum: enumsToUse }),
      IsEnum(enumsToUse, {
        message: `Available values: ${enumsToUse}`,
      }),
    );
}

export const ApiResponseArrayWithDescription = (
  items: Type<unknown>[],
  description: string,
) =>
  applyDecorators(
    ApiExtraModels(...items),
    ApiResponse({
      status: 200,
      schema: {
        description,
        items: {
          oneOf: items.map((item) => ({ $ref: getSchemaPath(item) })),
        },
        type: 'array',
      },
    }),
  );
