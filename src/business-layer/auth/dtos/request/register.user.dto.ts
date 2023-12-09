import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { USER_GENDER } from '../../../../data-access-layer/user-entity/entities/enums/user.gender';
import { lowerCaseTransformer } from '../../../../utils/transformers/lower-case.transformer';
import { LanguageModel } from '../../../i18n/model/language.model';


export class RegisterUserDTO {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;


  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  surname: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(LanguageModel.LANGUAGE, {
    message: `Available options ${Object.keys(LanguageModel.LANGUAGE)}`,
  })
  lang: LanguageModel.LANGUAGE;


  @IsEnum(USER_GENDER, {
    message: i18nValidationMessage('validation.BODY_VALIDATION.IS_ENUM', {
      values: Object.values(USER_GENDER),
    }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.BODY_VALIDATION.NOT_EMPTY'),
  })
  gender?: USER_GENDER;
}
