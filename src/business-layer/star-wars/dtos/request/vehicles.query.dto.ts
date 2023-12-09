import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SimulatePaginationQuery } from '../../../../models/data-access/simulate-pagination.service';

export class StarWarsVehiclesQuery extends SimulatePaginationQuery {
  @IsOptional()
  @ApiProperty({
    description: 'Search by name, model',
  })
  @IsString()
  search?: string | undefined;

}



