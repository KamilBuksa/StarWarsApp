import { BadRequestException, HttpException } from '@nestjs/common';
import { spiltStringOnUppercaseCharacter } from './regexp.utils';

export const uniqueIds = (ids: string[]): { ids: string[] } => {
  if (Array.isArray(ids) && ids.length) {
    const seen = new Set();
    const filteredArrUniqueIds = ids.filter((el) => {
      const duplicate = seen.has(el);
      seen.add(el);
      return !duplicate;
    });
    return {
      ids: filteredArrUniqueIds,
    };
  }
};

export const uniqueValuesFromArray = (values: string[]): string[] => {
  if (Array.isArray(values) && values.length) {
    const seen = new Set();
    const filteredArrUniqueIds = values.filter((el) => {
      const duplicate = seen.has(el);
      seen.add(el);
      return !duplicate;
    });
    return filteredArrUniqueIds;
  }
};

// example of usage:  const nearestObjectOnMap: ListPlaceResponseDTO = min(data, 'distance')
export const findObjectWithMaxValue = (array: any[], field: string) =>
  array.reduce((m, x) => (m[field] > x[field] ? m : x));
export const findObjectWithMinValue = (array: any, field: string) =>
  array.reduce((m, x) => (m[field] < x[field] ? m : x));

export const convertToArray = (stringIds: string): string[] => {
  return stringIds
    .toString()
    .split(',')
    .map((el) => el.trim());
};

export const isArray = (arr: unknown[]): boolean => {
  if (Array.isArray(arr) && arr.length) return true;
  else return false;
};
export const uniqueObjectValuesFromArrayOfObjects = (
  array: { name: string }[],
) => Array.from(new Set(array.map((el) => el.name)));
export const isEmptyObj = (obj: unknown) => Object.keys(obj).length === 0;

export const groupArrayByKey = async (xs, key) => {
  if (isArray(xs)) {
    return xs.reduce(function (rv, x) {
      (rv[x[`${key}`]] = rv[x[`${key}`]] || []).push(x);
      return rv;
    }, {});
  }
};

export const areObjectsEqual = (obj1: unknown, obj2: unknown) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

export const handleError = (error: any) => {
  const { status, response, name } = error;
  let message = '';

  if (error instanceof HttpException) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Something went wrong';
  }

  if (Number(status) < 500) {
    if (response?.key) {
      throw new HttpException(
        {
          key: response.key,
          message,
          statusCode: status ? status : 403,
        },
        status ? status : 403,
        { cause: new Error() },
      );
    } else {
      throw new HttpException(
        {
          statusCode: status ? status : 403,
          message,
          error: name
            ? spiltStringOnUppercaseCharacter(name).join(' ').trim()
            : 'Error Occurred',
        },
        status ? status : 403,
        { cause: new Error() },
      );
    }
  } else {
    console.error(error);
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException();
    } else {
      throw new BadRequestException(message);
    }
  }
};

export const calculateMinutesToReadArticle = (texts: string[]): number => {
  if (isArray(texts)) {
    const text = texts.join(' ');
    const wpm = 200; // in general 265 words per minute but here we will use 200
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return time;
  }
};

export const sortArrayByCreatedAt = (array: any[]): any[] => {
  return array.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const removeDuplicates = <T>(arr: T[]): T[] => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};
