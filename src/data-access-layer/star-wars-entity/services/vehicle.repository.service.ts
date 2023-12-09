import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { VehicleEntity } from '../entities/vehicle.entity';

export class VehicleRepositoryService extends AbstractCrudRepositoryService<VehicleEntity> {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly _vehicleRepository: Repository<VehicleEntity>,
  ) {
    super(_vehicleRepository);
  }

}
