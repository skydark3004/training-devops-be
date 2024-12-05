import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from '../purchase.enum';
import { PurchaseHelper } from './purchase.helper';
import { ListPurchaseDto, UpdatePurchaseDto } from './purchase.dto';
import { EntityManager, ILike, IsNull } from 'typeorm';
import { EnumStatusOfPurchase } from 'src/core/enum';
import { PurchaseRepository, VoucherRepository } from 'src/module-repository/repository';
import { PurchaseEntity, VoucherEntity } from 'src/core/entity';

@Injectable()
export class PurchaseService {
  constructor(
    private helper: PurchaseHelper,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly voucherRepository: VoucherRepository,
  ) {}

  async getList(query: ListPurchaseDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const queryBuilder = this.purchaseRepository.typeOrm
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.user', 'user')
      .leftJoinAndSelect('purchase.package', 'package')
      .leftJoinAndSelect('purchase.voucher', 'voucher')
      .where('1=1');

    if (query.keySearch) {
      queryBuilder.andWhere(
        '(user.fullName ILIKE :keySearch OR user.username ILIKE :keySearch OR user.phoneNumber ILIKE :keySearch OR purchase.transactionId ILIKE :keySearch)',
        {
          keySearch: `%${query?.keySearch}%`,
        },
      );
    }

    if (query.statusOfPurchase) {
      queryBuilder.andWhere('purchase.statusOfPurchase = :statusOfPurchase', { statusOfPurchase: query.statusOfPurchase });
    }

    const list = await this.purchaseRepository.queryBuilderWithPaginate({ pagination: pagination, queryBuilder });

    return list;
  }

  async updateById(id: string, body: UpdatePurchaseDto) {
    const getById = await this.purchaseRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.PURCHASE_NOT_FOUND);

    /*     if (getById.statusOfPurchase !== EnumStatusOfPurchase.CUSTOMER_CONFIRMED) {
      throw new BadRequestException(`Chỉ có thể cập nhật khi trạng thái thanh toán là KH xác nhận`);
    } */

    await this.purchaseRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawVoucherRepo = entityManager.getRepository(VoucherEntity);
      const rawPurchaseRepo = entityManager.getRepository(PurchaseEntity);

      if (body.statusOfPurchase === EnumStatusOfPurchase.CANCEL) {
        const voucher = await rawVoucherRepo.findOne({ where: { id: getById.voucherId } });
        await rawVoucherRepo.update({ id: voucher.id }, { usedQuantity: voucher.usedQuantity - 1, remainingQuantity: voucher.remainingQuantity + 1 });
      }

      const paramToUpdate: any = {
        statusOfPurchase: body.statusOfPurchase,
      };
      if (body.statusOfPurchase === EnumStatusOfPurchase.COMPLETED) {
        paramToUpdate.isUseNow = true;
      }

      await rawPurchaseRepo.update({ id }, paramToUpdate);
    });

    return { message: 'Thành công' };
  }
}
