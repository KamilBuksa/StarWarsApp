import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../../data-access-layer/user-entity/entities/user.entity';

class AccessTokenData {
  type: 'Bearer';
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
  })
  expiresIn: string | number;
  accessToken: string;
  constructor(tokenData: AccessTokenData) {
    this.type = tokenData?.type;
    this.expiresIn = tokenData?.expiresIn;
    this.accessToken = tokenData?.accessToken;
  }
}

class LoginUserResponseDTO {
  id: string;
  status: USER_STATUS | null;
  role: USER_ROLE;
  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.status = userEntity.status;
    this.role = userEntity.role;
  }
}

export class LoginResponseDTO {
  user: LoginUserResponseDTO;
  tokenData?: AccessTokenData;
  constructor(userEntity: UserEntity, tokenData: AccessTokenData) {
    this.user = new LoginUserResponseDTO(userEntity);
    this.tokenData = tokenData ? new AccessTokenData(tokenData) : null;
  }
}
