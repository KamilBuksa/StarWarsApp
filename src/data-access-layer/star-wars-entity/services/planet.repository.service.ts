import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { PlanetEntity } from '../entities/planet.entity';
import { StarWarsPlanetsQuery } from '../../../business-layer/star-wars/dtos/request/planets.query.dto';
import { ApiModel } from '../../../models/api.model';

export class PlanetRepositoryService extends AbstractCrudRepositoryService<PlanetEntity> {
  constructor(
    @InjectRepository(PlanetEntity)
    private readonly _planetRepository: Repository<PlanetEntity>,
  ) {
    super(_planetRepository);
  }
  async findAllPaginatedPlanets(
    filterData: StarWarsPlanetsQuery,
  ): Promise<ApiModel.PaginatedResponse<PlanetEntity>> {
    let search = this._planetRepository.createQueryBuilder('planet');

    if (filterData.search) {
      search = search.andWhere(
        '((planet.name LIKE :search) OR (planet.climate LIKE :search))',
        {
          search: `%${filterData.search}%`,
        },
      );
    }

    const [data, totalCount]: [PlanetEntity[], number] = await search
      .skip((filterData.page - 1) * filterData.limit)
      .orderBy('planet.createdAt', 'DESC')
      .take(filterData.limit)
      .getManyAndCount();

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }
}
