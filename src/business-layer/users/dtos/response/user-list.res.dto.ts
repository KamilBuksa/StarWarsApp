import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';
import { ShortUserResponseDTO } from './user.res.dto';

export class UserListAdminResponseDTO extends ShortUserResponseDTO {
  status: USER_STATUS;
  email: string;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.status = userEntity.status;
    this.email = userEntity.email;
  }
}
