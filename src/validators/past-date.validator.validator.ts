import { ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPastDate',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return !moment(value).isBefore(moment());
        },
      },
    });
  };
}
