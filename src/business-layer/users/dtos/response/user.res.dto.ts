import { USER_GENDER } from '../../../../data-access-layer/user-entity/entities/enums/user.gender';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { LanguageModel } from '../../../i18n/model/language.model';

// +
export class ShortUserResponseDTO {
  id: string;
  createdAt: string;
  modifiedAt: string;
  lastActivityDate: Date;
  name: string;
  surname: string;
  lang: LanguageModel.LANGUAGE;
  email: string;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.createdAt = userEntity.createdAt;
    this.modifiedAt = userEntity.modifiedAt;
    this.lastActivityDate = userEntity.lastActivityDate;
    this.name = userEntity.name;
    this.surname = userEntity.surname;
    this.lang = userEntity.lang;
    this.email = userEntity.email;

  }
}
// +
export class CurrentUserResponseDTO extends ShortUserResponseDTO {
  role: USER_ROLE;
  status: USER_STATUS;
  email: string;
  lang: LanguageModel.LANGUAGE;
  isAccountVerified: boolean;
  gender?: USER_GENDER;

  constructor(userEntity: UserEntity,) {
    super(userEntity);
    this.role = userEntity.role;
    this.status = userEntity.status;
    this.email = userEntity.email;
    this.lang = userEntity.lang;
    this.isAccountVerified = userEntity.isAccountVerified;
    this.gender = userEntity.gender;
  }
}

// +
export class UserAdminResponseDTO extends ShortUserResponseDTO {
  status: USER_STATUS;
  isAccountVerified: boolean;
  email: string;
  role: USER_ROLE;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.status = userEntity.status;

    this.isAccountVerified = userEntity.isAccountVerified;
    this.email = userEntity.email;

    this.role = userEntity.role;

  }
}
// +
export class UserDetailsAdminResponseDTO extends ShortUserResponseDTO {
  role: USER_ROLE;
  status: USER_STATUS;
  email: string;
  lang: LanguageModel.LANGUAGE;
  isAccountVerified: boolean;
  gender: USER_GENDER;
  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.role = userEntity.role;
    this.status = userEntity.status;
    this.email = userEntity.email;
    this.lang = userEntity.lang;
    this.isAccountVerified = userEntity.isAccountVerified;
    this.gender = userEntity.gender;

  }
}

