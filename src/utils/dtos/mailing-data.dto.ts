import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { lowerCaseTransformer } from '../transformers/lower-case.transformer';

export class MailingDataDTO {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}

export class ManyMailingDataDTO {
  @IsOptional()
  @ArrayNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MailingDataDTO)
  mailingData?: MailingDataDTO[];
}

export class MailingDataRes {
  email: string;
  html: string;
  constructor(
    email: string,
    html: string,
  ) {
    this.email = email;
    this.html = html;
  }
}
