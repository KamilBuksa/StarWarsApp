import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../../guards/local-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ApiModel } from '../../../models/api.model';
import { LanguageHeadersModel } from '../../i18n/model/language-headers.model';
import { ChangePasswordDTO } from '../dtos/request/change-password.dto';
import { ConfirmRegistrationQueryDTO } from '../dtos/request/confirm-registration.query.dto';
import { EmailParamDTO } from '../dtos/request/email.dto';
import { RegisterUserDTO } from '../dtos/request/register.user.dto';
import { RemindPasswordSetNewPasswordDTO } from '../dtos/request/remind-password.dto';
import { TokenParamDTO } from '../dtos/request/token.dto';
import { LoginResponseDTO } from '../dtos/response/login-user.response.dto';
import { RegisterUserResponseDTO } from '../dtos/response/register-user.response.dto';
import { AuthService } from '../services/auth.service';
import { RegisterUserService } from '../services/register-user.service';
import { UserPasswordService } from '../services/user-password.service';
import { AccessGuard } from '../../../guards/access.guard';
import { LoginDTO } from '../dtos/request/login.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _registerUserService: RegisterUserService,
    private readonly _userPasswordService: UserPasswordService,
  ) {}

  @ApiOperation({
    summary: 'Login',
  })
  @ApiBody({ type: LoginDTO })
  @UseGuards(LocalAuthGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Post('login')
  async login(
    @Request() req: ApiModel.RequestWithUser,
    @Body() data: LoginDTO,
  ): Promise<LoginResponseDTO> {
    return this._authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Register',
  })
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Post('register')
  createNewUser(
    @Body() data: RegisterUserDTO,
    @Req() { responseLanguage }: ApiModel.RequestWithLanguageHeaders,
  ): Promise<RegisterUserResponseDTO> {
    return this._registerUserService.registerUser(data, responseLanguage);
  }

  // TODO email aktywacyjny
  @ApiOperation({
    summary: 'Confirm email registration',
    description:
      'Click on link in email to confirm registration. When you click on link, your account will also get sms verification code.',
  })
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Put('register/confirm-registration/:token')
  async activateUser(
    @Param() { token }: TokenParamDTO,
    @Query() query: ConfirmRegistrationQueryDTO,
  ): Promise<ApiModel.StatusResponse> {
    return this._registerUserService.confirmRegistration(token, query);
  }

  @ApiOperation({
    summary: 'Send confirm email registration email again',
  })
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Put('register/send-confirm-registration-email/:email')
  async sendConfirmRegistrationEmail(
    @Param() { email }: EmailParamDTO,
    @Req() { responseLanguage }: ApiModel.RequestWithLanguageHeaders,
  ): Promise<ApiModel.StatusResponse> {
    return this._registerUserService.sendConfirmRegistrationEmail(
      email,
      responseLanguage,
    );
  }

  @ApiOperation({
    summary:
      'Change password. User must be logged in. User must provide current password and new password.',
  })
  @ApiBearerAuth()
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Put('change-password')
  async changeUserPassword(
    @Req() req: ApiModel.RequestWithUser,
    @Body() data: ChangePasswordDTO,
  ): Promise<ApiModel.StatusResponse> {
    return this._userPasswordService.changePassword(req.user.id, data);
  }

  @ApiOperation({
    summary:
      'Remind password, step 2/2 - set new password. User must provide token from email and new password.',
  })
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Post('remind-password/new-password')
  async remindPasswordSetNewPassword(
    @Body() data: RemindPasswordSetNewPasswordDTO,
  ): Promise<ApiModel.StatusResponse> {
    return this._userPasswordService.remindPasswordSetNewPassword(data);
  }

  @ApiOperation({
    summary:
      'Remind password, step 1/2 - send email with link to remind password. User must provide email.',
  })
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Post('remind-password/:email')
  async remindUserPassword(
    @Param() { email }: EmailParamDTO,
    @Req() { responseLanguage }: ApiModel.RequestWithLanguageHeaders,
  ): Promise<ApiModel.StatusResponse> {
    return this._userPasswordService.remindPasswordSendEmail(
      email,
      responseLanguage,
    );
  }
}
