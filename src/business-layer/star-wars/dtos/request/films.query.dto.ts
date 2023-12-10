import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SimulatePaginationQuery } from '../../../../models/data-access/simulate-pagination.dto';

export class StarWarsFilmsQuery extends SimulatePaginationQuery {
  @IsOptional()
  @ApiProperty({
    description: 'Search by title',
  })
  @IsString()
  search?: string | undefined;
}
