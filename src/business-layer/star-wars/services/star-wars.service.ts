import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { FilmRepositoryService } from '../../../data-access-layer/star-wars-entity/services/film.repository.service';
import { PlanetRepositoryService } from '../../../data-access-layer/star-wars-entity/services/planet.repository.service';
import { SpeciesRepositoryService } from '../../../data-access-layer/star-wars-entity/services/species.repository.service';
import { StarshipRepositoryService } from '../../../data-access-layer/star-wars-entity/services/starship.repository.service';
import { VehicleRepositoryService } from '../../../data-access-layer/star-wars-entity/services/vehicle.repository.service';
import { ApiModel } from '../../../models/api.model';
import { preparePaginatedSimulatedResponse } from '../../../models/data-access/simulate-pagination.dto';
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
import { StarWarsHelpersService } from './star-wars-helpers.service';
import { isArray } from '../../../utils/other.utils';

@Injectable()
export class StarWarsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly StarWarsHelpersService: StarWarsHelpersService,
    private readonly filmRepository: FilmRepositoryService,
    private readonly speciesRepository: SpeciesRepositoryService,
    private readonly vehicleRepository: VehicleRepositoryService,
    private readonly starshipRepository: StarshipRepositoryService,
    private readonly planetRepository: PlanetRepositoryService

  ) { }

  async getFilms(
    query: StarWarsFilmsQuery,
  ): Promise<ApiModel.PaginatedResponse<FilmResponseDTO>> {
    let api = `https://swapi.dev/api/films`;

    if (query.search) {
      api = `https://swapi.dev/api/films?search=${query.search}`;
    }
    console.log('object');
    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get<any>(api, {}).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );

    if (isArray(results)) {
      const films = results.map((filmData: any) => this.StarWarsHelpersService.mapToFilmEntity(filmData));
      await this.filmRepository.save(films);
    }

    const response = await this.filmRepository.findAllPaginatedFilms(query);

    const data = []

    for await (const film of response.data) {
      data.push(new FilmResponseDTO(film));
    }


    return {
      ...response,
      data,
    };
  }

  async getSpecies(
    query: StarWarsSpeciesQuery,
  ): Promise<ApiModel.PaginatedResponse<SpeciesResponseDTO>> {
    let api = `https://swapi.dev/api/species`;

    if (query.search) {
      api = `https://swapi.dev/api/species?search=${query.search}`;
    }

    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get<any>(api, {}).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );

    if (isArray(results)) {
      const species = results.map((specieData: any) => this.StarWarsHelpersService.mapToSpeciesEntity(specieData));
      await this.speciesRepository.save(species);
    }

    const response = results.map(
      (el) => new SpeciesResponseDTO(el),
    );
    return preparePaginatedSimulatedResponse(response, {
      limit: query.limit,
      page: query.page,
    });
  }

  async getVehicles(
    query: StarWarsVehiclesQuery,
  ): Promise<ApiModel.PaginatedResponse<VehicleResponseDTO>> {
    let api = `https://swapi.dev/api/vehicles`;

    if (query.search) {
      api = `https://swapi.dev/api/vehicles?search=${query.search}`;
    }

    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get<any>(api, {}).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );
    if (isArray(results)) {
      const vehicles = results.map((vehicleData: any) => this.StarWarsHelpersService.mapToVehicleEntity(vehicleData));
      await this.vehicleRepository.save(vehicles);
    }

    const response = results.map(
      (el) => new VehicleResponseDTO(el),
    );
    return preparePaginatedSimulatedResponse(response, {
      limit: query.limit,
      page: query.page,
    });
  }

  async getStarships(
    query: StarWarsStarshipsQuery,
  ): Promise<ApiModel.PaginatedResponse<StarshipResponseDTO>> {
    let api = `https://swapi.dev/api/starships`;

    if (query.search) {
      api = `https://swapi.dev/api/starships?search=${query.search}`;
    }

    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get<any>(api, {}).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );
    if (isArray(results)) {
      const starships = results.map((starshipData: any) => this.StarWarsHelpersService.mapToStarshipEntity(starshipData));
      await this.starshipRepository.save(starships);
    }

    const response = results.map(
      (el) => new StarshipResponseDTO(el),
    );
    return preparePaginatedSimulatedResponse(response, {
      limit: query.limit,
      page: query.page,
    });
  }

  async getPlanets(
    query: StarWarsPlanetsQuery,
  ): Promise<ApiModel.PaginatedResponse<PlanetResponseDTO>> {
    let api = `https://swapi.dev/api/planets`;

    if (query.search) {
      api = `https://swapi.dev/api/planets?search=${query.search}`;
    }

    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get<any>(api, {}).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );
    if (isArray(results)) {
      const planets = results.map((planetData: any) => this.StarWarsHelpersService.mapToPlanetEntity(planetData));
      await this.planetRepository.save(planets);
    }

    const response = results.map(
      (el) => new PlanetResponseDTO(el),
    );
    return preparePaginatedSimulatedResponse(response, {
      limit: query.limit,
      page: query.page,
    });
  }
}
