import {
  Injectable
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { handleError } from '../../../utils/other.utils';
import { UserHelpersService } from '../../users/services/user-helpers.service';
import {
  LoginResponseDTO
} from '../dtos/response/login-user.response.dto';
import { AuthHelpersService } from './auth-helpers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _userHelpersService: UserHelpersService,
    private readonly _authHelpersService: AuthHelpersService,
    private readonly _configService: ConfigService,
  ) { }

  public async login(
    user: UserEntity,
  ): Promise<LoginResponseDTO> {
    try {
      const userData = user;

      this._authHelpersService.validateUserStatus(user.status, {
        isAccountVerified: userData.isAccountVerified,
      });
      await this._userHelpersService.updateLastActivity(user);

      const expiresIn = this._configService.get<string>('AUTH_ACCESS_TOKEN_EXPIRES_IN')

      const accessToken = await this._authHelpersService.generateJwtToken(
        userData,
        expiresIn,
      );

      return new LoginResponseDTO(
        user,
        {
          type: 'Bearer',
          expiresIn,
          accessToken,
        },
      );
    } catch (error) {
      handleError(error);
    }
  }



}
