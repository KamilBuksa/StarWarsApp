/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PAGINATION_BASE_LIMIT, PAGINATION_BASE_PAGE } from "../../utils/dtos/pagination-query.dto";




export class SimulatePaginationQuery {
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
  search?: string | undefined;
}

export const simulatePaginateResults = <T>(results: T[], query: { limit?: number, page?: number }): T[] => {
  const limit = query?.limit ? Number(query.limit) : 10;
  const page = query?.page ? Number(query.page) : 1;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return results.slice(startIndex, endIndex);
};

export const preparePaginatedSimulatedResponse = <T>(
  allData: T[],
  paginationQuery: { limit: number, page: number }
): { data: T[], meta: any } => {
  const data = simulatePaginateResults(allData, paginationQuery);
  const totalCount = allData.length;

  return {
    data,
    meta: {
      total: totalCount,
      per_page: paginationQuery.limit,
      current_page: paginationQuery.page,
      last_page: totalCount === 0 ? 0 : Math.ceil(totalCount / paginationQuery.limit),
    },
  };
};
