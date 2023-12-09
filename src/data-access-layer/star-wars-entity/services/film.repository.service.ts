import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { FilmEntity } from '../entities/film.entity';

export class FilmRepositoryService extends AbstractCrudRepositoryService<FilmEntity> {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly _filmRepository: Repository<FilmEntity>,
  ) {
    super(_filmRepository);
  }

}
