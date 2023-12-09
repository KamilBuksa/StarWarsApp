import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ApiModel } from '../../../models/api.model';
import {
  ApiResponseArrayWithDescription,
  ApiSwaggerModel,
} from '../../../models/api.swagger.model';
import { LanguageHeadersModel } from '../../i18n/model/language-headers.model';
import { UpdateUserDTO } from '../dtos/request/update.user.dto';
import { CurrentUserResponseDTO } from '../dtos/response/user.res.dto';
import {
  UserUpdateAdminResponseDTO,
  UserUpdateResponseDTO,
} from '../dtos/response/user.update.res.dto';
import { UserService } from '../services/user.service';
import { AccessGuard } from '../../../guards/access.guard';

@ApiBearerAuth()
@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly _userService: UserService) {}

  @ApiOperation({
    summary: 'Update profile,',
  })
  @ApiSwaggerModel.ApiResponseWithExtraModule(UserUpdateResponseDTO)
  @ApiBody({ type: UpdateUserDTO })
  @Roles(USER_ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Put()
  updateProfile(
    @Body() data: UpdateUserDTO,
    @Req() req: ApiModel.RequestWithUser,
  ): Promise<UserUpdateResponseDTO | UserUpdateAdminResponseDTO> {
    return this._userService.updateProfile(data, req.user, undefined);
  }

  @ApiOperation({ summary: 'Delete user profile' })
  @Roles(USER_ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Delete()
  deleteSelf(
    @Req() req: ApiModel.RequestWithUser,
  ): Promise<ApiModel.StatusResponse> {
    return this._userService.deleteMyProfile(req.user);
  }

  @ApiOperation({
    summary: 'Current user - profile and companies where user belongs',
  })
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('current')
  @ApiResponseArrayWithDescription(
    [CurrentUserResponseDTO],
    'Response for current user ',
  )
  async getCurrentUser(
    @Req() req: ApiModel.RequestWithUser,
  ): Promise<CurrentUserResponseDTO> {
    return this._userService.getCurrentUser(req.user);
  }
}
