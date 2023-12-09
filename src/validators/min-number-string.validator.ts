import { ValidationOptions, registerDecorator } from 'class-validator';

export function MinNumberString(
  min: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'MinNumberString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return Number(value) >= min;
        },
      },
    });
  };
}
