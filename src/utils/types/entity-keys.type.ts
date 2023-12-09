import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type EntityKeys<TEntity> = (keyof QueryDeepPartialEntity<TEntity>)[];
