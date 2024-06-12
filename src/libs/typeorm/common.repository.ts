import {
  DataSource,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { isFloat } from '../utils';

interface IPagination {
  page: number;
  pageSize: number;
}

export class CommonRepository<T> extends Repository<T> {
  typeOrm: Repository<T>;
  constructor(target: EntityTarget<T>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
    this.typeOrm = dataSource.getRepository(target);
  }

  getAllCols() {
    return this.metadata.columns.map((col) => col.propertyName) as (keyof T)[];
  }

  async findWithPaginate(params?: {
    conditions?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
    pagination?: IPagination;
    relations?: FindOptionsRelations<T>;
    order?: FindOptionsOrder<T>;
  }) {
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
    });

    let totalPage = totalItems / pageSize;
    if (isFloat(totalPage)) totalPage += 1;
    totalPage = parseInt(totalPage.toString());

    if (params?.pagination?.pageSize === -1) {
      totalPage = 1;
    }

    const result = { data: data, totalItems, page: page, pageSize: pageSize, totalPage };
    return result;
  }

  async findById(id: string, options?: { relations?: FindOptionsRelations<any>; select?: FindOptionsSelect<any> }) {
    const param: FindOneOptions = {
      where: { id: id },
      relations: options?.relations,
      select: options?.select,
    };
    const getById = await this.findOne(param);
    return getById;
  }

  async findOneByParams(options: {
    conditions: FindOptionsWhere<any>;
    relations?: FindOptionsRelations<any>;
    select?: FindOptionsSelect<any> | FindOptionsSelectByString<any>;
  }) {
    const param: FindOneOptions = {
      where: options.conditions,
      relations: options?.relations,
      select: options?.select,
    };
    const getById = await this.findOne(param);
    return getById;
  }
}
