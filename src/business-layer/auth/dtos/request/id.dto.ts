import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class IdParamDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}


export class IdParamNumberDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
