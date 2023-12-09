import { Module } from '@nestjs/common';

import { StarWarsController } from './controllers/star-wars.controller';
import { StarWarsService } from './services/star-wars.service';
@Module({
  controllers: [StarWarsController],
  providers: [StarWarsService],
  imports: [],
  exports: [],
})
export class StarWarsModule {}
