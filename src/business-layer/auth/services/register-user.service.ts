import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';
import { UserRepositoryService } from '../../../data-access-layer/user-entity/providers/user.repository.service';
import { I18nPath } from '../../../generated/i18n.generated';
import { ApiModel } from '../../../models/api.model';
import { DateUtils } from '../../../utils/date.utils';
import { handleError } from '../../../utils/other.utils';
import { LanguageModel } from '../../i18n/model/language.model';
import { MailService } from '../../mailer/services/mailer.service';
import { UserHelpersService } from '../../users/services/user-helpers.service';
import { ConfirmRegistrationQueryDTO } from '../dtos/request/confirm-registration.query.dto';
import { RegisterUserDTO } from '../dtos/request/register.user.dto';
import { RegisterUserResponseDTO } from '../dtos/response/register-user.response.dto';
import { AuthHelpersService } from './auth-helpers.service';

@Injectable()
export class RegisterUserService {
  constructor(
    private readonly _userRepositoryService: UserRepositoryService,
    private readonly _userHelpersService: UserHelpersService,
    private readonly _mailService: MailService,
    private readonly _authHelpersService: AuthHelpersService,
  ) { }

  async registerUser(
    data: RegisterUserDTO,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    responseLanguage: LanguageModel.LANGUAGE,
  ): Promise<RegisterUserResponseDTO> {
    try {
      if (data.password.length < 6)
        throw new ForbiddenException({
          key: 'validation.AUTH__PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS_LONG',
        } as { key: I18nPath });

      await this._userHelpersService.validateUser({
        email: data.email,
      });

      const [userEntity]: [UserEntity,] =
        await this._userHelpersService.createUserEntity(data,);

      const token = await this._authHelpersService.generateToken();
      userEntity.activateAccountTokenExpirationDate = DateUtils.getNextDay(
        new Date(),
      );
      userEntity.activateAccountToken = token;

      const newUser: UserEntity = await this._userRepositoryService.save(
        userEntity,
      );

      // send registration email
      this._authHelpersService.sendRegistrationEmail({
        email: newUser.email,
        lang: responseLanguage,
        token,
      });

      const tokenData: UserEntity | undefined =
        await this._userRepositoryService.findOneBy(
          { id: newUser.id },
          { skipStatus: true },
        );

      const accessToken = await this._authHelpersService.generateJwtToken(
        tokenData,
      );

      return new RegisterUserResponseDTO(newUser, accessToken);
    } catch (err) {
      handleError(err);
    }
  }

  async confirmRegistration(
    token: string,
    query: ConfirmRegistrationQueryDTO,
  ): Promise<ApiModel.StatusResponse> {
    try {
      const user: UserEntity | undefined =
        await this._userRepositoryService.findOneByActivateAccountToken(token);
      await this._validateActivateRegistrationToken(user);

      const { affected } = await this._userRepositoryService.update(user.id, {
        activateAccountToken: null,
        activateAccountTokenExpirationDate: null,
        isAccountVerified: true,
      });


      return {
        status: true,
      };
    } catch (error) {
      handleError(error);
    }
  }

  private async _validateActivateRegistrationToken(
    user: UserEntity,
  ): Promise<boolean> {
    if (!user) {
      throw new NotFoundException({
        key: 'validation.LINK_IS_EXPIRED_OR_INVALID',
      } as {
        key: I18nPath;
      });
    }

    if (!(new Date(user.activateAccountTokenExpirationDate) >= new Date())) {
      throw new NotAcceptableException({ key: 'validation.TOKEN_EXPIRED' } as {
        key: I18nPath;
      });
    }
    return true;
  }

  async sendConfirmRegistrationEmail(
    email: string,
    responseLanguage: LanguageModel.LANGUAGE,
  ): Promise<ApiModel.StatusResponse> {
    try {
      const userEntity: UserEntity | undefined =
        await this._userRepositoryService.findOneBy(
          { email },
          { skipStatus: true },
        );
      if (!userEntity)
        throw new NotFoundException({ key: 'validation.USER_NOT_FOUND' } as {
          key: I18nPath;
        });

      if (userEntity.isAccountVerified) {
        throw new ForbiddenException({
          key: 'validation.USER_ALREADY_ACTIVATED',
        });
      }

      const token = await this._authHelpersService.generateToken();

      await this._userRepositoryService.update(userEntity.id, {
        activateAccountToken: token,
        activateAccountTokenExpirationDate: DateUtils.getNextDay(new Date()),
      });

      await this._mailService.sendMail({
        lang: responseLanguage ?? LanguageModel.DEFAULT_LANGUAGE,
        email: userEntity.email,
        template: 'email-account-activation',
        subject: 'validation.EMAIL_ACTIVATE_ACCOUNT.SUBJECT',
        variables: {
          link: `${process.env.FRONT_URL}${responseLanguage === LanguageModel.LANGUAGE.EN
            ? ''
            : `/${responseLanguage}`
            }/confirm-email/${token}`,
        },
        choseAttachments: {
          step1: true,
          step2: true,
        },
      });

      return { status: true };
    } catch (error) {
      handleError(error);
    }
  }


}
