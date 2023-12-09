import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class StarWarsFilmsQuery {
  @IsOptional()
  @ApiProperty({
    description: 'Search by title',
  })
  @IsString()
  search?: string | undefined;

}



