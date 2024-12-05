import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { arrayNormalToObject, isFloat } from '../utils';
import { GetSelectColumnsParams, IPagination, TypeResponsePagination } from './common.interface';

export class CommonRepository<T> {
  typeOrm: Repository<T>;
  constructor(target: EntityTarget<T>, dataSource: DataSource) {
    const manager = dataSource.createEntityManager();
    this.typeOrm = new Repository(target, manager);
  }

  getSelectColumns(params?: GetSelectColumnsParams<T>): FindOptionsSelect<T> {
    const convertColumns = arrayNormalToObject(params?.columns || []);
    const obj: any = {};
    for (const column of this.typeOrm.metadata.columns) {
      const nameOfColumn = column.propertyName;
      const isSelected = params?.type === 'SELECT' ? convertColumns[nameOfColumn] : !convertColumns[nameOfColumn];
      if (isSelected) {
        obj[nameOfColumn] = true;
      }
    }
    return obj;
  }

  async findWithPaginate(params?: {
    conditions?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
    pagination?: IPagination;
    relations?: FindOptionsRelations<T>;
    order?: FindOptionsOrder<T>;
    select?: FindOptionsSelect<T>;
  }): Promise<TypeResponsePagination<T>> {
    const page = params?.pagination?.page || 1;
    let pageSize = params?.pagination?.pageSize || 20;
    let skip = (page - 1) * pageSize;

    if (params?.pagination?.pageSize === -1) {
      skip = undefined;
      pageSize = undefined;
    }

    const order: any = params?.order || { createdAt: 'ASC' };

    const [data, totalItems] = await this.typeOrm.findAndCount({
      where: params?.conditions,
      skip,
      take: pageSize,
      relations: params?.relations,
      order: order,
      select: params?.select,
    });

    let totalPage = totalItems / pageSize || 1;
    if (isFloat(totalPage)) totalPage += 1;
    totalPage = parseInt(totalPage.toString());

    if (params?.pagination?.pageSize === -1) {
      totalPage = 1;
    }

    const result = { data: data, totalItems, page: page, pageSize: pageSize, totalPage };
    return result;
  }

  async findById(
    id: string,
    options?: { relations?: FindOptionsRelations<T>; select?: FindOptionsSelect<T>; order?: FindOptionsOrder<T> },
  ): Promise<T | null> {
    const param: FindOneOptions = {
      where: { id: id },
      relations: options?.relations,
      select: options?.select,
      order: options?.order,
    };
    const getById = await this.typeOrm.findOne(param);
    return getById;
  }

  async findOneByParams(options: {
    conditions: FindOptionsWhere<T>;
    relations?: FindOptionsRelations<T>;
    select?: FindOptionsSelect<T>;
    order?: FindOptionsOrder<T>;
  }): Promise<T | null> {
    const param: FindOneOptions = {
      where: options.conditions,
      relations: options?.relations,
      select: options?.select,
      order: options?.order,
    };
    const getById = await this.typeOrm.findOne(param);
    return getById;
  }

  async findAllByParams(options?: {
    conditions?: FindOptionsWhere<T>;
    relations?: FindOptionsRelations<T>;
    select?: FindOptionsSelect<T>;
    order?: FindOptionsOrder<T>;
    take?: number;
  }): Promise<T[]> {
    const param: FindManyOptions = {
      where: options?.conditions,
      relations: options?.relations,
      select: options?.select,
      order: options?.order,
      take: options?.take,
    };
    const getById = await this.typeOrm.find(param);
    return getById;
  }

  async useTransaction(callback: (entityManager: EntityManager) => Promise<any>) {
    return await this.typeOrm.manager.transaction(async (manager: EntityManager) => {
      return callback(manager);
    });
  }

  async saveWithoutTransaction(entity: DeepPartial<T>, options?: Omit<SaveOptions, 'transaction'>) {
    return await this.typeOrm.save(entity, { ...options, transaction: false });
  }

  /**
   * @description build array thành raw query với array. Giả sử ``['abc', 'def']``
   * @returns ``('abc','xyz')``
   */
  buildArrayToStringInRawQuery(array: string[]): string {
    return `(${array.map((item) => `'${item}'`).join(',')})`;
  }

  async queryBuilderWithPaginate(params: { pagination?: IPagination; queryBuilder: SelectQueryBuilder<T> }) {
    const { queryBuilder } = params;
    const page = params?.pagination?.page || 1;
    let pageSize = params?.pagination?.pageSize || 20;
    let skip = (page - 1) * pageSize;

    if (params?.pagination?.pageSize === -1) {
      skip = undefined;
      pageSize = undefined;
    }

    const [data, totalItems] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    let totalPage = totalItems / pageSize;
    if (isFloat(totalPage)) totalPage += 1;
    totalPage = parseInt(totalPage.toString());

    if (params?.pagination?.pageSize === -1) {
      totalPage = 1;
    }

    const result = { data: data, totalItems, page: page, pageSize: pageSize, totalPage };
    return result;
  }

  /**
   * @description build hàm COALESCE thành raw query với array. Giả sử ``['x', 'y', 'z']``
   * @returns ``COALESCE('x', 'y', 'z' )``
   */
  getNotNullValueWithCoalesce(array: string[]): string {
    return `COALESCE( ${array.map((item) => `'${item}'`).join(',')} )`;
  }
}
