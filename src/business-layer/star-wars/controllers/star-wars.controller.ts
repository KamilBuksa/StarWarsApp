import {
  Controller, Get, Query, UseGuards
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../decorators/roles.decorator';
import { AccessGuard } from '../../../guards/access.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ApiSwaggerModel } from '../../../models/api.swagger.model';
import { LanguageHeadersModel } from '../../i18n/model/language-headers.model';
import { UserAdminResponseDTO } from '../../users/dtos/response/user.res.dto';
import { StarWarsFilmsQuery } from '../dtos/request/films.query.dto';
import { StarWarsService } from '../services/star-wars.service';
import { ApiModel } from '../../../models/api.model';
import { FilmResponseDTO } from '../dtos/response/films.response.dto';
import { StarWarsSpeciesQuery } from '../dtos/request/species.query.dto';
import { SpeciesResponseDTO } from '../dtos/response/species.response.dto';
import { StarWarsVehiclesQuery } from '../dtos/request/vehicles.query.dto';
import { VehicleResponseDTO } from '../dtos/response/vehicles.response.dto';

@ApiBearerAuth()
@ApiTags('Star Wars')
@Controller('/star-wars')
export class StarWarsController {
  constructor(private readonly _starWarsService: StarWarsService) { }


  @ApiOperation({
    summary: 'Show list of films',
    description: "Search by title",
  })
  @ApiSwaggerModel.ApiOkResponsePaginated(FilmResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/films')
  getFilms(
    @Query() query: StarWarsFilmsQuery,
  ): Promise<ApiModel.PaginatedResponse<FilmResponseDTO>> {
    return this._starWarsService.getFilms(query);
  }

  @ApiOperation({
    summary: 'Show list of species.',
    description: "Search by name",
  })
  @ApiSwaggerModel.ApiOkResponsePaginated(SpeciesResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/species')
  getSpecies(
    @Query() query: StarWarsSpeciesQuery,
  ): Promise<ApiModel.PaginatedResponse<SpeciesResponseDTO>> {
    return this._starWarsService.getSpecies(query);
  }

  @ApiOperation({
    summary: 'Show list of vehicles.',
    description: "Search by name, model",
  })
  @ApiSwaggerModel.ApiOkResponsePaginated(VehicleResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/vehicles')
  getVehicles(
    @Query() query: StarWarsVehiclesQuery,
  ): Promise<ApiModel.PaginatedResponse<VehicleResponseDTO>> {
    return this._starWarsService.getVehicles(query);
  }

}