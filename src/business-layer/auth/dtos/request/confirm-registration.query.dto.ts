import { Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiModel } from '../../../../models/api.model';
import { toBoolean } from '../../../../utils/typeHelper';

export const carSortOptions = ['id'];

export class ConfirmRegistrationQueryDTO {
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  withoutSms?: boolean | undefined = undefined;
}
