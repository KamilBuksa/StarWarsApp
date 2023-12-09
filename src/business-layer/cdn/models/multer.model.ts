import { UnsupportedMediaTypeException } from '@nestjs/common';
import * as crypto from 'crypto';
import { sep } from 'path';

export namespace MulterModel {
  export const UPLOAD_DIR: string = './upload';
  export const MAX_FILE_SIZE: number = 1024 * 1024 * 20; // max size - 20 mb
  export const convertToUniversalUrl = (url: string) =>
    url.split(sep).join('/');

  export const arrayOfAvailableToCompress = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/PNG',
    'image/JPEG',
    'image/JPG',
  ];

  const documents = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/PDF',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'application/RTF',
    'application/vnd.oasis.opendocument.spreadsheet',
    'text/csv',
  ];

  const videos = [
    'video/x-msvideo',
    'video/mp4',
    'video/ogg',
    'video/mp2t',
    'video/webm',
    'video/3gpp',
    'video/3gpp2',
  ];
  export const arrayOfAvailable = [
    ...arrayOfAvailableToCompress,
    'image/heic',
    // videos
    // ...videos,
    // documents
    ...documents,
  ];
  export const fileFilter = (req: any, file: any, cb: any) => {
    const mimetype = file.mimetype;
    if (arrayOfAvailable.includes(mimetype)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new UnsupportedMediaTypeException(
          `Unsupported file mimetype ${mimetype}. Supported files: ${arrayOfAvailable}`,
        ),
        false,
      );
    }
  };

  export const filename = async (req, file, cb) => {
    //Calling the callback passing the random name generated with the original extension name
    const randomName: string = crypto
      .randomBytes(25)
      .toString('hex')
      .slice(0, 25);

    cb(null, `${randomName}_${file.originalname}`);
  };
}
