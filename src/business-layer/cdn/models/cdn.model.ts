import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { FILE_CONTENT_TYPE } from '../../../data-access-layer/file-entity/entities/content.type';
import { FileEntity } from '../../../data-access-layer/file-entity/entities/file.entity';
import { FILE_STATUS } from '../../../data-access-layer/file-entity/entities/file.status';
import { FILE_TYPE } from '../../../data-access-layer/file-entity/entities/file.type';

export namespace CDNModel {
  export const TYPES_AVAILABLE_TO_DELETE = [FILE_TYPE.AVATAR];

  export class ChangeFilePositionDTO {
    @IsNotEmpty()
    @IsUUID()
    fileId: string;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    order: number;
  }

  export class FileToObjectDTO {
    @IsNotEmpty()
    @IsEnum(FILE_CONTENT_TYPE, {
      message: `Available values: ${Object.keys(FILE_CONTENT_TYPE)}`,
    })
    contentType: FILE_CONTENT_TYPE | undefined;

    @IsNotEmpty()
    @IsUUID()
    fileId: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    order: number;
  }

  export class FilesUrlDTO {
    @IsNotEmpty()
    @IsString()
    fileId: string;
  }

  // output from @UploadedFile() decorator
  export type UploadedFile = {
    isCompress: boolean;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
    fileId: string;
    compressFileId: string;
  };

  export class UploadedFileResponse {
    fileId: string;
  }

  export class FileResponseDTO {
    id: string;
    originalname: string;
    createdAt: string;
    type: FILE_TYPE;
    url: string;
    order: number;
    contentType: FILE_CONTENT_TYPE;
    status?: FILE_STATUS;
    constructor(fileEntity: FileEntity, showUrl?: boolean) {
      this.id = fileEntity.id;
      this.originalname = fileEntity.originalname;
      this.createdAt = fileEntity.createdAt;
      this.type = fileEntity.type;
      this.contentType = fileEntity.contentType;
      this.order = fileEntity.order;

      if (showUrl) {
        this.url =
          `${process.env.API_URL}cdn/files-url?fileId=` + fileEntity.id;
      }
    }
  }
}
