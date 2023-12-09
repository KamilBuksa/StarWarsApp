import { IsNotEmpty, IsEnum } from 'class-validator';
import { LanguageModel } from '../../../i18n/model/language.model';

export class UpdateLanguageDTO {
  @IsNotEmpty()
  @IsEnum(LanguageModel.LANGUAGE, {
    message: `Available values: ${Object.values(LanguageModel.LANGUAGE)}`,
  })
  lang: LanguageModel.LANGUAGE;
}
