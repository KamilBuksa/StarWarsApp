import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiModel } from '../../../models/api.model';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { FilmEntity } from '../entities/film.entity';
import { StarWarsFilmsQuery } from '../../../business-layer/star-wars/dtos/request/films.query.dto';

export class FilmRepositoryService extends AbstractCrudRepositoryService<FilmEntity> {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly _filmRepository: Repository<FilmEntity>,
  ) {
    super(_filmRepository);
  }
  async findAllPaginatedFilms(
    filterData: StarWarsFilmsQuery,
  ): Promise<ApiModel.PaginatedResponse<FilmEntity>> {
    let search = this._filmRepository
      .createQueryBuilder('film')

    if (filterData.search) {
      search = search.andWhere(
        '((film.title LIKE :search) OR (film.director LIKE :search))',
        {
          search: `%${filterData.search}%`,
        },
      );
    }


    const [data, totalCount]: [FilmEntity[], number] = await search

      .skip((filterData.page - 1) * filterData.limit)
      .orderBy('film.createdAt', 'DESC')
      .take(filterData.limit)
      .getManyAndCount();

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }
}
