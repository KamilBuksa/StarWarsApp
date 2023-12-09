import {
  Controller, Get, Query, UseGuards
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StarWarsService } from '../services/star-wars.service';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../decorators/roles.decorator';
import { AccessGuard } from '../../../guards/access.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ApiModel } from '../../../models/api.model';
import { ApiSwaggerModel } from '../../../models/api.swagger.model';
import { LanguageHeadersModel } from '../../i18n/model/language-headers.model';
import { UserListAdminResponseDTO } from '../../users/dtos/response/user-list.res.dto';
import { UserAdminResponseDTO } from '../../users/dtos/response/user.res.dto';
import { AdminUsersQuery } from '../../users/dtos/request/get.user.dto';
import { StarWarsFilmsQuery } from '../dtos/request/films.query.dto';

@ApiBearerAuth()
@ApiTags('Star Wars')
@Controller('/star-wars')
export class StarWarsController {
  constructor(private readonly _starWarsService: StarWarsService) { }


  @ApiOperation({ summary: 'Show list of films' })
  @ApiSwaggerModel.ApiOkResponsePaginated(UserAdminResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/films')
  getAll(
    @Query() query: StarWarsFilmsQuery,
  ): Promise<any> {
    return this._starWarsService.getFilms(query);
  }

}
