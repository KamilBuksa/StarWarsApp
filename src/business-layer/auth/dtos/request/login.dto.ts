import {
  IsEmail,
  IsNotEmpty,
  IsString
} from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;


}

