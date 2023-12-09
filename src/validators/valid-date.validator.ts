import { ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return moment(value, 'YYYY-MM-DD', true).isValid();
        },
      },
    });
  };
}
