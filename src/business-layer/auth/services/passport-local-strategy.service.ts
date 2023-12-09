import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';
import { Strategy } from 'passport-local';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { AuthHelpersService } from './auth-helpers.service';
import { LoginDTO, } from '../dtos/request/login.dto';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authHelpersService: AuthHelpersService,
    private readonly _i18nService: I18nService,
  ) {
    super({ usernameField: 'login', passReqToCallback: true });
  }

  /**
   * Function called by Passport Local Strategy on login request.
   * It's responsible for validating provided credentials and return UserDTO which will be added to @Request() req.user
   */

  async validate(
    req: Request & { body: LoginDTO },
    email: string,
    password: string,
    a: any,
  ): Promise<UserEntity> {
    const lang = req.headers['accept-language'];
    const user: UserEntity | null = await this._authHelpersService.validateUser(
      email,
      password,
      lang,
    );

    if (!user) {
      throw new UnauthorizedException(
        this._i18nService.t('validation.USER_NOT_FOUND', { lang }),
      );
    } else {
      delete user.password;
      return user;
    }
  }
}
