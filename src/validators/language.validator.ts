import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LanguageModel } from 'src/business-layer/i18n/model/language.model';

@ValidatorConstraint({ async: false })
export class LanguageValidator implements ValidatorConstraintInterface {
  validate(value: LanguageModel.I18nPropertyRaw, args: ValidationArguments) {
    return (
      value &&
      Object.keys(LanguageModel.LANGUAGE).every((ul: any) =>
        Object.keys(value).includes(ul),
      )
    );
  }
}
