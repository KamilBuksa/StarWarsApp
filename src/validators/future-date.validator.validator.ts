import { ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return !moment(value).isAfter(moment());
        },
      },
    });
  };
}
