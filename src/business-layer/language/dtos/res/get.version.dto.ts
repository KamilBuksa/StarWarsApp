import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { LanguageModel } from '../../../i18n/model/language.model';

export class LanguageResponse {
  id: string;
  lang: LanguageModel.LANGUAGE;
  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.lang = userEntity.lang;
  }
}
