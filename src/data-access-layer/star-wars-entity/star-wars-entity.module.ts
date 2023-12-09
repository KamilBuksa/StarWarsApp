import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './entities/film.entity';
import { PlanetEntity } from './entities/planet.entity';
import { SpeciesEntity } from './entities/specie.entity';
import { StarshipEntity } from './entities/starship.entity';
import { VehicleEntity } from './entities/vehicle.entity';
import { FilmRepositoryService } from './services/film.repository.service';
import { SpeciesRepositoryService } from './services/species.repository.service';
import { StarshipRepositoryService } from './services/starship.repository.service';
import { VehicleRepositoryService } from './services/vehicle.repository.service';
import { PlanetRepositoryService } from './services/planet.repository.service';


@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, SpeciesEntity, VehicleEntity, StarshipEntity, PlanetEntity])],
  providers: [FilmRepositoryService, SpeciesRepositoryService, VehicleRepositoryService, StarshipRepositoryService, PlanetRepositoryService],
  exports: [FilmRepositoryService, SpeciesRepositoryService, VehicleRepositoryService, StarshipRepositoryService, PlanetRepositoryService],
})
export class StarWarsEntityModule { }
