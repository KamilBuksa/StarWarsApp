import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { SpeciesEntity } from '../entities/specie.entity';

export class SpeciesRepositoryService extends AbstractCrudRepositoryService<SpeciesEntity> {
  constructor(
    @InjectRepository(SpeciesEntity)
    private readonly _speciesRepository: Repository<SpeciesEntity>,
  ) {
    super(_speciesRepository);
  }

}
