import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_ROLE } from '../../../data-access-layer/user-entity/entities/enums/user.roles';
import { Roles } from '../../../decorators/roles.decorator';
import { AccessGuard } from '../../../guards/access.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { ApiModel } from '../../../models/api.model';
import { ApiSwaggerModel } from '../../../models/api.swagger.model';
import { HttpCacheInterceptor } from '../../cache/cache.interceptor';
import { CACHE_KEYS } from '../../cache/constants/cache.keys';
import { TTL_CONSTANTS } from '../../cache/constants/ttl.constants';
import { LanguageHeadersModel } from '../../i18n/model/language-headers.model';
import { StarWarsFilmsQuery } from '../dtos/request/films.query.dto';
import { StarWarsPlanetsQuery } from '../dtos/request/planets.query.dto';
import { StarWarsSpeciesQuery } from '../dtos/request/species.query.dto';
import { StarWarsStarshipsQuery } from '../dtos/request/starships.query.dto';
import { StarWarsVehiclesQuery } from '../dtos/request/vehicles.query.dto';
import { FilmResponseDTO } from '../dtos/response/films.response.dto';
import { PlanetResponseDTO } from '../dtos/response/planets.response.dto';
import { SpeciesResponseDTO } from '../dtos/response/species.response.dto';
import { StarshipResponseDTO } from '../dtos/response/starships.response.dto';
import { VehicleResponseDTO } from '../dtos/response/vehicles.response.dto';
import { StarWarsService } from '../services/star-wars.service';
import { ApiUniqueWordsResponse } from '../dtos/response/api-unique-words.response.dto';

@ApiBearerAuth()
@ApiTags('Star Wars')
@Controller('/star-wars')
export class StarWarsController {
  constructor(
    private readonly _starWarsService: StarWarsService,

  ) { }

  @ApiOperation({
    summary: 'Show list of films',
    description: 'Search by title',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(TTL_CONSTANTS.ONE_DAY)
  @CacheKey(CACHE_KEYS.GET_FILMS_LIST_CACHE_KEY)
  @ApiSwaggerModel.ApiOkResponsePaginated(FilmResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/films')
  async getFilms(
    @Query() query: StarWarsFilmsQuery,
  ): Promise<ApiModel.PaginatedResponse<FilmResponseDTO>> {
    return await this._starWarsService.getFilms(query);
  }

  @ApiOperation({
    summary: 'Show list of species.',
    description: 'Search by name',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(TTL_CONSTANTS.ONE_DAY)
  @CacheKey(CACHE_KEYS.GET_SPECIES_LIST_CACHE_KEY)
  @ApiSwaggerModel.ApiOkResponsePaginated(SpeciesResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/species')
  async getSpecies(
    @Query() query: StarWarsSpeciesQuery,
  ): Promise<ApiModel.PaginatedResponse<SpeciesResponseDTO>> {
    return await this._starWarsService.getSpecies(query);
  }

  @ApiOperation({
    summary: 'Show list of vehicles.',
    description: 'Search by name, model',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(TTL_CONSTANTS.ONE_DAY)
  @CacheKey(CACHE_KEYS.GET_VEHICLES_LIST_CACHE_KEY)
  @ApiSwaggerModel.ApiOkResponsePaginated(VehicleResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/vehicles')
  async getVehicles(
    @Query() query: StarWarsVehiclesQuery,
  ): Promise<ApiModel.PaginatedResponse<VehicleResponseDTO>> {
    return await this._starWarsService.getVehicles(query);
  }

  @ApiOperation({
    summary: 'Show list of starships.',
    description: 'Search by name, model',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(TTL_CONSTANTS.ONE_DAY)
  @CacheKey(CACHE_KEYS.GET_STARSHIPS_LIST_CACHE_KEY)
  @ApiSwaggerModel.ApiOkResponsePaginated(StarshipResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/starships')
  async getStarships(
    @Query() query: StarWarsStarshipsQuery,
  ): Promise<ApiModel.PaginatedResponse<StarshipResponseDTO>> {
    return await this._starWarsService.getStarships(query);
  }

  @ApiOperation({
    summary: 'Show list of planets.',
    description: 'Search by name',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(TTL_CONSTANTS.ONE_DAY)
  @CacheKey(CACHE_KEYS.GET_PLANETS_LIST_CACHE_KEY)
  @ApiSwaggerModel.ApiOkResponsePaginated(PlanetResponseDTO)
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @LanguageHeadersModel.LanguageHeadersGuardDecorator()
  @Get('/planets')
  async getPlanets(
    @Query() query: StarWarsPlanetsQuery,
  ): Promise<ApiModel.PaginatedResponse<PlanetResponseDTO>> {
    return await this._starWarsService.getPlanets(query);
  }


  @ApiOperation({ summary: 'Find Unique Word Pairs and Their Occurrences', description: "This endpoint allows you to find unique word pairs and count their occurrences in text. Word pairs are separated by spaces or any number of control characters, and the result is a list of these pairs along with the count of their occurrences." })
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, AccessGuard)
  @Get('unique-word-pairs')
  async getUniqueWordsAndCharacterName(): Promise<ApiUniqueWordsResponse> {
    return await this._starWarsService.getUniqueWordsAndMostFrequentCharacter();
  }

}
