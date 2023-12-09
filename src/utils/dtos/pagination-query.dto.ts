import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsNotEmpty,
  IsString,
} from 'class-validator';

const PAGINATION_BASE_PAGE = 1;
const PAGINATION_BASE_LIMIT = 10;

export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = PAGINATION_BASE_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = PAGINATION_BASE_LIMIT;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  query?: string | undefined;
}
