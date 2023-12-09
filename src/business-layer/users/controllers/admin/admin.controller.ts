import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from '../../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../../decorators/roles.decorator';
import { AccessGuard } from '../../../../guards/access.guard';
import { JwtAuthGuard } from '../../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../../guards/roles.guard';
import { ApiModel } from '../../../../models/api.model';
import { ApiSwaggerModel } from '../../../../models/api.swagger.model';
import { IdParamDTO } from '../../../auth/dtos/request/id.dto';
import { LanguageHeadersModel } from '../../../i18n/model/language-headers.model';
import { AdminUsersQuery } from '../../dtos/request/get.user.dto';
import { UserStatusDTO } from '../../dtos/request/update.user.dto';
import { UserListAdminResponseDTO } from '../../dtos/response/user-list.res.dto';
import {
  UserAdminResponseDTO,
  UserDetailsAdminResponseDTO,
} from '../../dtos/response/user.res.dto';
import {
  UserUpdateAdminResponseDTO,
  UserUpdateResponseDTO,
} from '../../dtos/response/user.update.res.dto';
import { AdminService } from '../../services/admin/admin.service';
import { UserService } from '../../services/user.service';

@ApiBearerAuth()
@ApiTags('users - ADMIN')
@Controller('/users')
export class AdminsController {
  constructor(
    private readonly _adminService: AdminService,
    private readonly _userService: UserService,
  ) {}

  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @ApiOperation({ summary: 'Change user status' })
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @Patch('statuses')
  changeUserStatus(@Body() data: UserStatusDTO): Promise<UserAdminResponseDTO> {
    return this._adminService.changeUserStatus(data);
  }

  @ApiOperation({ summary: 'Show list of users' })
  @ApiSwaggerModel.ApiOkResponsePaginated(UserAdminResponseDTO)
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('')
  getAll(
    @Query() query: AdminUsersQuery,
  ): Promise<
    ApiModel.PaginatedResponse<UserListAdminResponseDTO | UserAdminResponseDTO>
  > {
    return this._adminService.findAllUsers(query);
  }

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @ApiOperation({ summary: 'Show user details for admin' })
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get(`/details/:id`)
  async getUserDetails(
    @Param() { id }: IdParamDTO,
  ): Promise<UserDetailsAdminResponseDTO> {
    return this._adminService.getUserDetails(id);
  }

  @ApiOperation({
    summary: 'Update user profile,',
  })
  @ApiSwaggerModel.ApiResponseWithExtraModule(UserUpdateAdminResponseDTO)
  @ApiBody({ type: UserUpdateAdminResponseDTO })
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Put('/update/:id')
  updateProfile(
    @Body() data: UserUpdateAdminResponseDTO,
    @Req() req: ApiModel.RequestWithUser,
    @Param() { id }: IdParamDTO,
  ): Promise<UserUpdateResponseDTO | UserUpdateAdminResponseDTO> {
    return this._userService.updateProfile(data, req.user, id);
  }
}
