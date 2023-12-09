import { ValidationOptions, registerDecorator } from 'class-validator';

export function MaxNumberString(
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'MaxNumberString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return Number(value) <= max;
        },
      },
    });
  };
}
