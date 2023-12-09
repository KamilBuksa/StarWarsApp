import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UserIdParamDTO {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UsersIdsDTO {
  @ArrayUnique()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  usersIds: string[];
}
