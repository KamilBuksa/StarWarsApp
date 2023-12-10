import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { RegisterUserDTO } from '../../../auth/dtos/request/register.user.dto';
import { LanguageModel } from '../../../i18n/model/language.model';
import { ApiSwaggerModel } from '../../../../models/api.swagger.model';
import { i18nValidationMessage } from 'nestjs-i18n';
import { USER_GENDER } from '../../../../data-access-layer/user-entity/entities/enums/user.gender';

export class UpdateUserDTO extends PartialType(
  PickType(RegisterUserDTO, ['email', 'name', 'surname'] as const),
) {
  @IsOptional()
  @IsEnum(USER_GENDER, {
    message: i18nValidationMessage('validation.BODY_VALIDATION.IS_ENUM', {
      values: Object.values(USER_GENDER),
    }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.BODY_VALIDATION.NOT_EMPTY'),
  })
  gender?: USER_GENDER;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(LanguageModel.LANGUAGE, {
    message: `Available values: ${Object.values(LanguageModel.LANGUAGE)}`,
  })
  lang?: LanguageModel.LANGUAGE;
}

export type UpdateInterface = Omit<UpdateUserDTO, ''>;

export class UserStatusDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiSwaggerModel.ApiEnum([USER_STATUS.ACTIVATED, USER_STATUS.BLOCKED])
  status: USER_STATUS;
}
