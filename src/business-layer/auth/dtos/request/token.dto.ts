import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class TokenParamDTO {
  @IsNotEmpty()
  @IsString()
  @Length(0, 64)
  token: string;
}
