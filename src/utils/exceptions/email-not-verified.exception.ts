import { HttpException, HttpExceptionOptions } from '@nestjs/common';

// 440 - is good status code for custom error, for next codes - just increment, for example 441, 442, 443, 444, 445, 446, 447, 448, 449, 450

export class EmailNotVerifiedException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions:
      | string
      | HttpExceptionOptions = `Mu custom test error`,
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(
        { key: 'validation.EMAIL_NOT_VERIFIED' },
        description,
        440,
      ),
      440,
      httpExceptionOptions,
    );
  }
}

