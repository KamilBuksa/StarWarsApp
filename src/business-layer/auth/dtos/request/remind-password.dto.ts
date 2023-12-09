import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RemindPasswordSetNewPasswordDTO {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  remindPasswordToken: string;
}
