import { UserEntity } from '../../../data-access-layer/user-entity/entities/user.entity';

export type HandleFilesToAssignOptionsInterface = {
  user: UserEntity;
  isPublic: boolean;
  startOrderFrom?: number;
};

export interface SharpCompressionWorkerRunOptions {
  fullPathToFile: string;
  pathToCompressionFile: string;
}

export interface ConvertToJpgWorkerRunOptions {
  message: {
    filePath: string;
    destination: string;
    filename: string;
  };
}
