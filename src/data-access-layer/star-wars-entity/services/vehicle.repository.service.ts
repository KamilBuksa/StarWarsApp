import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { VehicleEntity } from '../entities/vehicle.entity';
import { StarWarsVehiclesQuery } from '../../../business-layer/star-wars/dtos/request/vehicles.query.dto';
import { ApiModel } from '../../../models/api.model';

export class VehicleRepositoryService extends AbstractCrudRepositoryService<VehicleEntity> {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly _vehicleRepository: Repository<VehicleEntity>,
  ) {
    super(_vehicleRepository);
  }
  async findAllPaginatedVehicles(
    filterData: StarWarsVehiclesQuery,
  ): Promise<ApiModel.PaginatedResponse<VehicleEntity>> {
    let search = this._vehicleRepository.createQueryBuilder('vehicle');

    if (filterData.search) {
      search = search.andWhere(
        '((vehicle.name LIKE :search) OR (vehicle.model LIKE :search))',
        {
          search: `%${filterData.search}%`,
        },
      );
    }

    const [data, totalCount]: [VehicleEntity[], number] = await search
      .skip((filterData.page - 1) * filterData.limit)
      .orderBy('vehicle.createdAt', 'DESC')
      .take(filterData.limit)
      .getManyAndCount();

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }
}
