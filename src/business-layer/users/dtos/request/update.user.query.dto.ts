import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

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
