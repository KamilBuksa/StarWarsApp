import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class StarWarsApiService {
  constructor(private readonly httpService: HttpService) {}

  async fetchDataFromSwApi(apiUrl: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
