import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { SpeciesEntity } from '../entities/specie.entity';
import { StarWarsSpeciesQuery } from '../../../business-layer/star-wars/dtos/request/species.query.dto';
import { ApiModel } from '../../../models/api.model';

export class SpeciesRepositoryService extends AbstractCrudRepositoryService<SpeciesEntity> {
  constructor(
    @InjectRepository(SpeciesEntity)
    private readonly _speciesRepository: Repository<SpeciesEntity>,
  ) {
    super(_speciesRepository);
  }
  async findAllPaginatedSpecies(
    filterData: StarWarsSpeciesQuery,
  ): Promise<ApiModel.PaginatedResponse<SpeciesEntity>> {
    let search = this._speciesRepository
      .createQueryBuilder('species');

    if (filterData.search) {
      search = search.andWhere(
        '((species.name LIKE :search) OR (species.classification LIKE :search))',
        {
          search: `%${filterData.search}%`,
        },
      );
    }

    const [data, totalCount]: [SpeciesEntity[], number] = await search
      .skip((filterData.page - 1) * filterData.limit)
      .orderBy('species.createdAt', 'DESC')
      .take(filterData.limit)
      .getManyAndCount();

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }

}
