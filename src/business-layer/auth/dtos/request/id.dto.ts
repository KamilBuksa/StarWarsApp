import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParamDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
