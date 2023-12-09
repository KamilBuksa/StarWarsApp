import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ApiModel } from '../../../models/api.model';
import { LanguageHeadersModel } from '../../i18n/model/language-headers.model';
import { AdminUserUpdateQuery } from '../../users/dtos/request/update.user.query.dto';
import { UpdateLanguageDTO } from '../dtos/req/update.language.dto';
import { LanguageResponse } from '../dtos/res/get.version.dto';
import { LanguageService } from '../services/language.service';
import { AccessGuard } from '../../../guards/access.guard';
@ApiBearerAuth()
@ApiTags('Language')
@Controller('/language')
export class LanguageController {
  constructor(private readonly _languageService: LanguageService) {}

  @ApiOperation({
    summary: 'Get user language',
  })
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get()
  async getUserLanguage(
    @Req() { user }: ApiModel.RequestWithUser,
  ): Promise<LanguageResponse> {
    return this._languageService.getUserLanguage(user);
  }

  @ApiOperation({
    summary: 'Change language',
  })
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Put('')
  changeLanguage(
    @Body() data: UpdateLanguageDTO,
    @Req() req: ApiModel.RequestWithUser,
    @Query() query: AdminUserUpdateQuery,
  ): Promise<LanguageResponse> {
    return this._languageService.changeLanguage(data, req.user, query);
  }
}
