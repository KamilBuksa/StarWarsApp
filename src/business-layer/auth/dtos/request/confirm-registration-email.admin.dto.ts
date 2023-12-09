import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, Max, MaxLength } from 'class-validator';
import { lowerCaseTransformer } from '../../../../utils/transformers/lower-case.transformer';

export class ConfirmRegistrationEmailAdminDTO {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  token: string;
}
