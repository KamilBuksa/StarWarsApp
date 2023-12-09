import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { StarshipEntity } from '../entities/starship.entity';

export class StarshipRepositoryService extends AbstractCrudRepositoryService<StarshipEntity> {
  constructor(
    @InjectRepository(StarshipEntity)
    private readonly _starshipRepository: Repository<StarshipEntity>,
  ) {
    super(_starshipRepository);
  }
}
