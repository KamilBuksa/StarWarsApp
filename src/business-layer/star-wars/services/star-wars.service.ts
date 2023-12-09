

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { preparePaginatedSimulatedResponse } from '../../../models/data-access/simulate-pagination.service';
import { StarWarsFilmsQuery } from '../dtos/request/films.query.dto';


@Injectable()
export class StarWarsService {
  constructor(
    private readonly httpService: HttpService


  ) { }

  async getFilms(query: StarWarsFilmsQuery): Promise<any> {
    let api = `https://swapi.dev/api/films`

    if (query.search) {
      api = `https://swapi.dev/api/films?search=${query.search}`
    }

    const { data: { results } } = await firstValueFrom(
      this.httpService.get<any>(api, {}).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened!';
        }),
      ),
    );
    return preparePaginatedSimulatedResponse(results, { limit: query.limit, page: query.page });
  }

}
