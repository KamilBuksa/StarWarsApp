import { ApiSwaggerModel } from '../../models/api.swagger.model';

export enum APPROVE_STATUS {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export class ApproveDTO {
  @ApiSwaggerModel.ApiEnum([...Object.values(APPROVE_STATUS)])
  status: APPROVE_STATUS;
}
