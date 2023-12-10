import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { StarshipEntity } from '../entities/starship.entity';
import { StarWarsStarshipsQuery } from '../../../business-layer/star-wars/dtos/request/starships.query.dto';
import { ApiModel } from '../../../models/api.model';

export class StarshipRepositoryService extends AbstractCrudRepositoryService<StarshipEntity> {
  constructor(
    @InjectRepository(StarshipEntity)
    private readonly _starshipRepository: Repository<StarshipEntity>,
  ) {
    super(_starshipRepository);
  }
  async findAllPaginatedStarships(
    filterData: StarWarsStarshipsQuery,
  ): Promise<ApiModel.PaginatedResponse<StarshipEntity>> {
    let search = this._starshipRepository
      .createQueryBuilder('starship');

    if (filterData.search) {
      search = search.andWhere(
        '((starship.name LIKE :search) OR (starship.model LIKE :search))',
        {
          search: `%${filterData.search}%`,
        },
      );
    }

    const [data, totalCount]: [StarshipEntity[], number] = await search
      .skip((filterData.page - 1) * filterData.limit)
      .orderBy('starship.createdAt', 'DESC')
      .take(filterData.limit)
      .getManyAndCount();

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }

}
