import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { PlanetEntity } from '../entities/planet.entity';

export class PlanetRepositoryService extends AbstractCrudRepositoryService<PlanetEntity> {
  constructor(
    @InjectRepository(PlanetEntity)
    private readonly _planetRepository: Repository<PlanetEntity>,
  ) {
    super(_planetRepository);
  }

}
