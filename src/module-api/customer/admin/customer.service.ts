import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from './customer.enum';
import {
  LevelOfCustomerRepository,
  LevelRepository,
  LevelSexologyOfCustomerRepository,
  LevelSexologyRepository,
  PurchaseRepository,
  UserRepository,
} from 'src/module-repository/repository';
import { EnumRoleCode } from 'src/core/enum';
import { ListCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomerServiceAdmin {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly levelOfCustomerRepository: LevelOfCustomerRepository,
    private readonly levelRepository: LevelRepository,
    private readonly levelSexologyRepository: LevelSexologyRepository,
    private readonly levelSexologyOfCustomerRepository: LevelSexologyOfCustomerRepository,
  ) {}

  async getListCustomer(query: ListCustomerDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const queryBuilder = this.userRepository.typeOrm
      .createQueryBuilder('user')
      .where('user.roleCode = :roleCode', { roleCode: EnumRoleCode.CUSTOMER })
      .leftJoinAndMapOne(
        'user.currentPackage', // tên field sau khi map sẽ trả ra khi return json
        'purchase', // tên table
        'purchase', // alias
        'purchase.userId = user.id AND purchase.isUseNow = true',
      )
      .leftJoinAndSelect('purchase.package', 'package')
      .select([
        'user.id',
        'user.fullName',
        'user.username',
        'user.phoneNumber',
        'user.age',
        'user.currentSexualDuration',
        'user.wishDuration',
        'user.createdAt',
        'user.status',
        'package.id',
        'package.name',
        'purchase.id',
        'purchase.isUseNow',
        'purchase.expiredAt',
      ]);

    if (query.keySearch) {
      queryBuilder.andWhere('(user.fullName ILIKE :keySearch OR user.username ILIKE :keySearch OR user.phoneNumber ILIKE :keySearch)', {
        keySearch: `%${query?.keySearch}%`,
      });
    }

    if (!_.isUndefined(query.status)) {
      queryBuilder.andWhere('user.status = :status', { status: query.status });
    }

    const listCustomer = await this.userRepository.queryBuilderWithPaginate({ pagination: pagination, queryBuilder });

    return listCustomer;
  }

  async getById(id: string) {
    const customer = await this.userRepository.typeOrm
      .createQueryBuilder('user')
      .where('user.roleCode = :roleCode', { roleCode: EnumRoleCode.CUSTOMER })
      .andWhere('user.id = :id', { id: id })
      .leftJoinAndMapOne(
        'user.currentPackage', // tên field sau khi map sẽ trả ra khi return json
        'purchase', // tên table
        'purchase', // alias
        'purchase.userId = user.id AND purchase.isUseNow = true',
      )
      .leftJoin('purchase.package', 'package')
      .select([
        'user.id',
        'user.fullName',
        'user.username',
        'user.phoneNumber',
        'user.age',
        'user.currentSexualDuration',
        'user.wishDuration',
        'user.createdAt',
        'user.status',
        'user.description',
        'package.id',
        'package.name',
        'purchase.id',
        'purchase.isUseNow',
        'purchase.expiredAt',
      ])
      .getOne();

    if (!customer) {
      throw new BadRequestException('Không tìm thấy khách hàng');
    }

    console.log(customer);

    return customer;
  }

  async getHistorySubscribe(userId: string) {
    const result = await this.purchaseRepository.findAllByParams({
      conditions: { userId },
      relations: { package: true },
    });

    return result;
  }

  async getLearningProgress(userId: string) {
    const [currentLevel, progressLevel, currentLevelSexology, progressLevelSexology] = await Promise.all([
      this.levelOfCustomerRepository.findOneByParams({ conditions: { isCompleted: false }, relations: { levelPc: true } }),

      this.levelRepository.typeOrm
        .createQueryBuilder('level')
        .leftJoinAndMapOne(
          'level.levelOfCustomer', // tên field sau khi map sẽ trả ra khi return json
          'level_of_customer', // tên table
          'level_of_customer', // alias
          'level_of_customer.levelPcId = level.id AND level_of_customer.userId = :userId',
          { userId },
        )
        .where('level.status = TRUE')
        .orWhere('level_of_customer.userId IS NOT NULL')
        .select('CAST(COUNT(DISTINCT level.id) AS INTEGER)', 'totalLevels')
        .addSelect(`CAST(COUNT(DISTINCT CASE WHEN level_of_customer.isCompleted = TRUE THEN level.id END) AS INTEGER)`, 'completedLevels')
        .getRawOne(),

      this.levelSexologyOfCustomerRepository.findOneByParams({
        conditions: { isCompleted: false },
        relations: { module: true, levelSexology: true },
      }),

      this.levelSexologyRepository.typeOrm
        .createQueryBuilder('level_sexology')
        .leftJoin(
          'level_sexology.levelOfCustomers',
          'level_sexology_of_customer',
          'level_sexology.id = level_sexology_of_customer.levelSexologyId AND level_sexology_of_customer.userId = :userId',
          { userId },
        )
        .where('level_sexology.status = TRUE')
        .orWhere('level_sexology_of_customer.userId IS NOT NULL')
        .select('CAST(COUNT(DISTINCT level_sexology.id) AS INTEGER)', 'totalLevels')
        .addSelect(
          `CAST(COUNT(DISTINCT CASE WHEN level_sexology_of_customer.isCompleted = TRUE THEN level_sexology.id END) AS INTEGER)`,
          'completedLevels',
        )
        .getRawOne(),
    ]);

    return { progressLevel, currentLevel, currentLevelSexology, progressLevelSexology };
  }

  async updateById(id: string, body: UpdateCustomerDto) {
    const getById = await this.userRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const updateParams: any = _.pick(body, ['description', 'status']);

    await this.userRepository.typeOrm.update({ id }, updateParams);
    const result = await this.getById(id);

    return result;
  }
}
