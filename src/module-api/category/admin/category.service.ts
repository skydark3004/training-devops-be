import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from '../category.enum';
import { CreateCategoryDto, ListCategoryDto, UpdateCategoryDto } from './dto';
import { ILike } from 'typeorm';
import { CategoryRepository } from 'src/module-repository/repository';

@Injectable()
export class CategoryServiceAdmin {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getList(query: ListCategoryDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    const list = await this.categoryRepository.findWithPaginate({
      conditions,
      pagination,
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.categoryRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return getById;
  }

  async create(body: CreateCategoryDto) {
    const getByName = await this.categoryRepository.findOneByParams({ conditions: { name: body.name } });
    if (getByName) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`);

    const category = await this.categoryRepository.typeOrm.save({ name: body.name, status: body.status }, { transaction: false });

    return category;
  }

  async updateById(id: string, body: UpdateCategoryDto) {
    const getById = await this.categoryRepository.findOneByParams({ conditions: { id } });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    const paramToUpdateCategory = _.pick(body, ['name', 'status']);
    await this.categoryRepository.typeOrm.update({ id }, paramToUpdateCategory);

    return await this.getById(id);
  }
}
