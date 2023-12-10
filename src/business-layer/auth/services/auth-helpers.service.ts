import {
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import * as randomstring from 'randomstring';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { USER_STATUS } from '../../../data-access-layer/user-entity/entities/enums/user.status';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../generated/i18n.generated';
import { EmailNotVerifiedException } from '../../../utils/exceptions/email-not-verified.exception';
import { handleError } from '../../../utils/other.utils';
import { PasswordsUtils } from '../../../utils/passwords.utilts';
import { LanguageModel } from '../../i18n/model/language.model';
import { MailService } from '../../mailer/services/mailer.service';

@Injectable()
export class AuthHelpersService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _i18nService: I18nService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _mailService: MailService,
  ) {}

  async generateToken(): Promise<string> {
    try {
      let token: undefined | string = randomstring.generate({
        length: 64,
        charset: 'alphanumeric',
      });
      const findUserByToken =
        await this._userRepositoryService.findOneByRemindToken(token);

      if (findUserByToken) {
        token = randomstring.generate({
          length: 64,
          charset: 'alphanumeric',
        });
      }

      return token;
    } catch (error) {
      handleError(error);
    }
  }

  async generateJwtToken(
    userData: UserEntity,
    expiresIn?: string,
  ): Promise<string> {
    const accessToken = this._jwtService.sign(
      { token_data: userData },
      {
        secret: this._configService.get<string>('AUTH_ACCESS_TOKEN_SECRET'),
        expiresIn:
          expiresIn ??
          this._configService.get<string>('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
    return accessToken;
  }

  public async validateUser(
    email: string,
    password: string,
    lang: LanguageModel.LANGUAGE,
  ): Promise<UserEntity> {
    try {
      const user: UserEntity | undefined =
        await this._userRepositoryService.findOneBy(
          { email: email.toLowerCase() },
          { withPassword: true, skipStatus: true },
        );

      if (!user)
        throw new NotFoundException(
          this._i18nService.t('validation.INCORRECT_LOGIN_OR_PASSWORD', {
            lang,
          }),
        );
      if (
        !user.password ||
        (user && !(await this._validateUserPassword(password, user)))
      ) {
        throw new ForbiddenException(
          this._i18nService.t('validation.INCORRECT_LOGIN_OR_PASSWORD', {
            lang,
          }),
        );
      }
      if (!user?.isAccountVerified) {
        throw new EmailNotVerifiedException();
      }

      if (user && (await this._validateUserPassword(password, user))) {
        return user;
      } else {
        throw new ForbiddenException(
          this._i18nService.t('validation.INCORRECT_LOGIN_OR_PASSWORD', {
            lang,
          }),
        );
      }
    } catch (error) {
      handleError(error);
    }
  }

  private async _validateUserPassword(
    password: string,
    user: UserEntity,
  ): Promise<boolean> {
    return PasswordsUtils.comparePassword(password, user.password);
  }

  validateUserStatus(
    status: USER_STATUS,
    options?: {
      validWaitingForAcceptanceStatus?: boolean;
      isAccountVerified?: boolean;
    },
  ): void {
    if ([false].includes(options?.isAccountVerified)) {
      throw new MethodNotAllowedException({
        key: 'validation.EMAIL_NOT_VERIFIED',
      } as { key: I18nPath });
    }

    if (
      options?.validWaitingForAcceptanceStatus &&
      status === USER_STATUS.WAITING_FOR_ACCEPTANCE
    ) {
      throw new NotFoundException({
        key: 'validation.CONFIRM_YOUR_ACCOUNT',
      } as { key: I18nPath });
    }

    if (status === USER_STATUS.BLOCKED) {
      throw new MethodNotAllowedException({
        key: 'validation.ACCOUNT_HAS_BEEN_BLOCKED',
      } as { key: I18nPath });
    }

    if (status === USER_STATUS.DELETED) {
      throw new MethodNotAllowedException({
        key: 'validation.ACCOUNT_HAS_BEEN_DELETED',
      } as { key: I18nPath });
    }
  }

  async sendRegistrationEmail(data: {
    lang: LanguageModel.LANGUAGE;
    email: string;
    token: string;
  }): Promise<void> {
    const { email, lang, token } = data;

    this._mailService.sendMail({
      lang,
      email: email,
      template: 'email-account-activation',
      subject: 'validation.EMAIL_ACTIVATE_ACCOUNT.SUBJECT',
      variables: {
        link: `${process.env.FRONT_URL}${
          lang === LanguageModel.LANGUAGE.EN ? '' : `/${lang}`
        }/confirm-email/${token}`,
      },
    });
  }
}
