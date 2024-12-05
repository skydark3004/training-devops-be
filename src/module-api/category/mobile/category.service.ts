import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from '../category.enum';
import { ListCategoryDto } from './dto';
import { ILike } from 'typeorm';
import { CategoryRepository, HistoryReadNutritionRepository, PurchaseRepository } from 'src/module-repository/repository';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';

@Injectable()
export class CategoryServiceMobile {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly historyReadNutritionRepository: HistoryReadNutritionRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async getList(query: ListCategoryDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {
      status: true,
    };
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }

    const list = await this.categoryRepository.findWithPaginate({
      conditions,
      pagination,
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getAll(currentUser: ICurrentUser) {
    const [list, isVip, histories] = await Promise.all([
      this.categoryRepository.typeOrm
        .createQueryBuilder('category')
        .where('category.status = :status', { status: true })
        .leftJoin('category.nutritions', 'nutrition')
        .select(['category.id', 'category.name', 'nutrition.index', 'nutrition.id', 'nutrition.pathThumbnail', 'nutrition.name', 'nutrition.isFree'])
        .orderBy({ 'nutrition.index': 'ASC' })
        .getMany(),

      this.purchaseRepository.findOneByParams({ conditions: { userId: currentUser.userId, isUseNow: true } }),

      this.historyReadNutritionRepository.findOneByParams({
        conditions: { userId: currentUser.userId },
      }),
    ]);

    const handleReadAndNormalAccount = list.map((category) => {
      const listNutrition = category.nutritions.map((el) => {
        if (isVip || el.isFree) {
          el.isAllowedToRead = true;
        }

        if (!isVip && !el.isFree) {
          el.isAllowedToRead = false;
        }

        el.isRead = histories?.listInObject?.[el.id] ? true : false;
        return el;
      });

      return { ...category, nutritions: listNutrition };
    });

    const result = this.categoryRepository.convertThumbnail(handleReadAndNormalAccount);
    return result;
  }

  async getById(id: string) {
    const getById = await this.categoryRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return getById;
  }
}
