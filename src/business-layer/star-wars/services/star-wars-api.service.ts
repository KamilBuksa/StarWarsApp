import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StarWarsApiService {
  constructor(private readonly httpService: HttpService) { }

  async fetchDataFromSwapi(apiUrl: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
      );
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }
}
