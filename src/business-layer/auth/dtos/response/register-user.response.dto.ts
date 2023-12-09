import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { LanguageModel } from '../../../i18n/model/language.model';



export class RegisterUserResponseDTO {
  id: string;
  status: USER_STATUS | null;
  name: string;
  surname: string;
  email: string;
  lang: LanguageModel.LANGUAGE;
  accessToken: string;

  constructor(userEntity: UserEntity, accessToken: string) {
    this.id = userEntity.id;
    this.status = userEntity.status;
    this.name = userEntity.name;
    this.surname = userEntity.surname;
    this.email = userEntity.email;
    this.lang = userEntity.lang;

    this.accessToken = accessToken;
  }
}
