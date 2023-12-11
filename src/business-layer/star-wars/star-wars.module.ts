import { Module } from '@nestjs/common';

import { StarWarsController } from './controllers/star-wars.controller';
import { StarWarsService } from './services/star-wars.service';
import { StarWarsEntityModule } from '../../data-access-layer/star-wars-entity/star-wars-entity.module';
import { StarWarsHelpersService } from './services/star-wars-helpers.service';
import { StarWarsApiService } from './services/star-wars-api.service';
@Module({
  controllers: [StarWarsController],
  providers: [StarWarsService, StarWarsHelpersService, StarWarsApiService],
  imports: [StarWarsEntityModule],
  exports: [],
})
export class StarWarsModule {}
