import { BadRequestException } from '@nestjs/common';

export const validateLatAndLng = (lat, lng) => {
  const pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');

  const test = pattern.test(lat) && pattern.test(lng);
  if (!test) {
    throw new BadRequestException('Wrong coordinates');
  } else {
    return true;
  }
};
