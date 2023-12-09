import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../generated/i18n.generated';
import { ApiModel } from '../../../models/api.model';
import { DateUtils } from '../../../utils/date.utils';
import { handleError } from '../../../utils/other.utils';
import { PasswordsUtils } from '../../../utils/passwords.utilts';
import { LanguageModel } from '../../i18n/model/language.model';
import { MailService } from '../../mailer/services/mailer.service';
import { ChangePasswordDTO } from '../dtos/request/change-password.dto';
import { RemindPasswordSetNewPasswordDTO } from '../dtos/request/remind-password.dto';
import { AuthHelpersService } from './auth-helpers.service';

@Injectable()
export class UserPasswordService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _authHelpersService: AuthHelpersService,
    private readonly _mailService: MailService,
    private readonly _configService: ConfigService,
  ) { }
  async changePassword(
    userId: string,
    data: ChangePasswordDTO,
  ): Promise<ApiModel.StatusResponse> {
    try {
      const user: UserEntity | undefined =
        await this._userRepositoryService.findOneBy(
          { id: userId },
          { withPassword: true, skipStatus: true },
        );

      if (!user) {
        throw new NotFoundException();
      }
      const passwordMatches = await PasswordsUtils.comparePassword(
        data.currentPassword,
        user.password,
      );

      if (!passwordMatches)
        throw new BadRequestException({
          key: 'validation.INVALID_PASSWORD',
        });
      user.password = await PasswordsUtils.hashPassword(data.newPassword);
      await this._userRepositoryService.save(user);

      return {
        status: true,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async remindPasswordSetNewPassword(
    data: RemindPasswordSetNewPasswordDTO,
  ): Promise<ApiModel.StatusResponse> {
    try {
      const user: UserEntity = await this._validateRemindPasswordToken(
        data.remindPasswordToken,
      );
      await this._userRepositoryService.update(user.id, {
        password: await PasswordsUtils.hashPassword(data.newPassword),
        remindPasswordToken: null,
      });

      return {
        status: true,
      };
    } catch (error) {
      handleError(error);
    }
  }
  async remindPasswordSendEmail(
    email: string,
    responseLanguage: LanguageModel.LANGUAGE,
  ): Promise<ApiModel.StatusResponse> {
    try {
      const userEntity: UserEntity | undefined =
        await this._userRepositoryService.findOneBy(
          { email },
          { skipStatus: true },
        );

      if (!userEntity) {
        throw new NotFoundException({ key: 'validation.USER_NOT_FOUND' } as {
          key: I18nPath;
        });
      }

      const token = await this._authHelpersService.generateToken();
      await this._userRepositoryService.update(userEntity.id, {
        remindPasswordToken: token,
        remindPasswordTokenExpirationDate: DateUtils.getPlusHours(
          new Date(),
          3,
        ),
      });

      await this._mailService.sendMail({
        lang: responseLanguage ?? LanguageModel.DEFAULT_LANGUAGE,
        email: userEntity.email,
        template: 'email-remind-password',
        subject: 'validation.EMAIL_REMIND_PASSWORD.SUBJECT',
        variables: {
          link: `${process.env.FRONT_URL}${responseLanguage === LanguageModel.LANGUAGE.EN
            ? ''
            : `/${responseLanguage}`
            }/change-password/${token}`,
          email: this._configService.get<string>('CONTACT_MAIL'), //
        },
      });

      return {
        status: true,
      };
    } catch (error) {
      handleError(error);
    }
  }

  private async _validateRemindPasswordToken(
    token: string,
  ): Promise<UserEntity> {
    try {
      const userEntity: UserEntity | undefined =
        await this._userRepositoryService.findOneBy(
          { remindPasswordToken: token },
          {
            select: ['id', 'remindPasswordTokenExpirationDate'],
            skipStatus: true,
          },
        );
      if (!userEntity) {
        throw new NotFoundException({
          key: 'validation.LINK_IS_EXPIRED_OR_INVALID',
        } as {
          key: I18nPath;
        });
      }

      if (
        !(new Date(userEntity.remindPasswordTokenExpirationDate) >= new Date())
      ) {
        throw new NotAcceptableException({
          key: 'validation.TOKEN_EXPIRED',
        } as {
          key: I18nPath;
        });
      }
      return userEntity;
    } catch (error) {
      handleError(error);
    }
  }
}
