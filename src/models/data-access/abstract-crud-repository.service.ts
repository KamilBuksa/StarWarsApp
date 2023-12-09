/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  In,
  InsertResult,
  ObjectID,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ApiModel } from '../api.model';

/**
 * Basic Repository responsible for retrieving data from DB
 * T - entity class
 */
export abstract class AbstractCrudRepositoryService<T> {
  constructor(private readonly _repository: Repository<T>) {}

  protected _preparePaginatedResponse(
    data: T[],
    totalCount: number,
    paginationQuery: ApiModel.PaginationQuery,
  ): ApiModel.PaginatedResponse<T> {
    return {
      data,
      meta: {
        total: totalCount,
        per_page: paginationQuery.limit,
        current_page: paginationQuery.page,
        last_page:
          totalCount === 0 ? 0 : Math.ceil(totalCount / paginationQuery.limit),
      },
    };
  }

  async remove(...data: T[]): Promise<T[]> {
    return this._repository.remove(data);
  }
  async save(data: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    return this._repository.save(data, options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return this._repository.create(data);
  }

  async saveMany(data: DeepPartial<T>[], options?: SaveOptions): Promise<T[]> {
    return this._repository.save(data, options);
  }

  async update(
    id: string | FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this._repository.update(id, data);
  }

  async updateMany(
    ids: string[],
    data: QueryDeepPartialEntity<T>,
    entity: any,
  ): Promise<UpdateResult> {
    return this._repository
      .createQueryBuilder()
      .update(entity)
      .set(data)
      .where({ id: In(ids) })
      .execute();
  }

  async updateQb(
    id: string,
    data: QueryDeepPartialEntity<T>,
    entity: any,
  ): Promise<UpdateResult> {
    return this._repository
      .createQueryBuilder()
      .update(entity)
      .set(data)
      .where({ id })
      .execute();
  }

  async removeQb(id: string): Promise<DeleteResult> {
    return this._repository
      .createQueryBuilder()
      .where({ id })
      .delete()
      .execute();
  }

  async merge(oldEntity: any, newEntity?: any): Promise<any> {
    return this._repository.merge(oldEntity, newEntity);
  }

  async insertQb(
    data: QueryDeepPartialEntity<T>[],
    entity: any,
  ): Promise<InsertResult> {
    return this._repository
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(data)
      .execute();
  }

  async softDeleteMany(ids: string[]): Promise<UpdateResult> {
    return this._repository
      .createQueryBuilder()
      .softDelete()
      .where({ id: In(ids) })
      .execute();
  }

  async increment(
    conditions: FindOptionsWhere<T>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    return await this._repository.increment(conditions, propertyPath, value);
  }

  async decrement(
    conditions: FindOptionsWhere<T>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    return await this._repository.decrement(conditions, propertyPath, value);
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
  ): Promise<UpdateResult> {
    return this._repository.softDelete(criteria);
  }

  async restoreSoftDelte(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
  ): Promise<UpdateResult> {
    return this._repository.restore(criteria);
  }

  async findByIdsWithSelectedData(ids: string[]): Promise<T[]> {
    const query = this._repository
      .createQueryBuilder('entity')
      .where('entity.id IN (:...ids)', { ids });

    return await query.select('entity.id').getMany();
  }

  async findOneByIdCore(id: string): Promise<T> {
    const query = this._repository
      .createQueryBuilder('entity')
      .where('entity.id = :id', { id });

    return await query.getOne();
  }

  async findOneForAppStatus(): Promise<T> {
    const query = this._repository.createQueryBuilder('user').select('user.id');
    return await query.getOne();
  }
}
