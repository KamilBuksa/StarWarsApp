import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { preparePaginatedSimulatedResponse } from '../../../models/data-access/simulate-pagination.dto';
import { StarWarsFilmsQuery } from '../dtos/request/films.query.dto';
import { FilmResponseDTO } from '../dtos/response/films.response.dto';
import { ApiModel } from '../../../models/api.model';
import { SpeciesResponseDTO } from '../dtos/response/species.response.dto';
import { StarWarsSpeciesQuery } from '../dtos/request/species.query.dto';
import { StarWarsVehiclesQuery } from '../dtos/request/vehicles.query.dto';
import { VehicleResponseDTO } from '../dtos/response/vehicles.response.dto';
import { StarWarsStarshipsQuery } from '../dtos/request/starships.query.dto';
import { StarshipResponseDTO } from '../dtos/response/starships.response.dto';
import { StarWarsPlanetsQuery } from '../dtos/request/planets.query.dto';
import { PlanetResponseDTO } from '../dtos/response/planets.response.dto';

@Injectable()
export class StarWarsService {
  constructor(private readonly httpService: HttpService) {}

  async getFilms(
    query: StarWarsFilmsQuery,
  ): Promise<ApiModel.PaginatedResponse<FilmResponseDTO>> {
    let api = `https://swapi.dev/api/films`;

    if (query.search) {
      api = `https://swapi.dev/api/films?search=${query.search}`;
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

    const response = results.map(
      (el: FilmResponseDTO) => new FilmResponseDTO(el),
    );
    return preparePaginatedSimulatedResponse(response, {
      limit: query.limit,
      page: query.page,
    });
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

    const response = results.map(
      (el: SpeciesResponseDTO) => new SpeciesResponseDTO(el),
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

    const response = results.map(
      (el: VehicleResponseDTO) => new VehicleResponseDTO(el),
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

    const response = results.map(
      (el: StarshipResponseDTO) => new StarshipResponseDTO(el),
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

    const response = results.map(
      (el: PlanetResponseDTO) => new PlanetResponseDTO(el),
    );
    return preparePaginatedSimulatedResponse(response, {
      limit: query.limit,
      page: query.page,
    });
  }
}
