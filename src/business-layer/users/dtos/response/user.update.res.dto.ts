import { USER_GENDER } from '../../../../data-access-layer/user-entity/entities/enums/user.gender';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { ShortUserResponseDTO } from './user.res.dto';

export class UserUpdateResponseDTO extends ShortUserResponseDTO {
  email: string;

  gender: USER_GENDER;
  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.email = userEntity.email;

    this.gender = userEntity.gender;
  }
}



export class UserUpdateAdminResponseDTO extends UserUpdateResponseDTO {
  isAccountVerified: boolean;
  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.isAccountVerified = userEntity.isAccountVerified;

  }
}
