import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { USER_STATUS } from '../../../../data-access-layer/user-entity/entities/enums/user.status';
import { ApiModel } from '../../../../models/api.model';
import { ApiSwaggerModel } from '../../../../models/api.swagger.model';

export class AdminUsersQuery extends ApiModel.PaginationQuery {
  @IsOptional()
  @ApiProperty({
    description: 'Search by name, surname, email,e',
  })
  @IsString()
  query?: string | undefined;

  @ApiSwaggerModel.ApiStringToArray([
    USER_STATUS.ACTIVATED,
    USER_STATUS.WAITING_FOR_ACCEPTANCE,
    USER_STATUS.BLOCKED,
  ])
  statuses?: USER_STATUS[];
}

export class AdminUserUpdateQuery {
  @ApiProperty({
    type: String,
    description:
      'Available only for admin. Admin can update data of any user by sending his userId',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  userId?: string;
}
