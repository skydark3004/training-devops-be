import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { EnumResponseError } from '../voucher.enum';
import { HelperParent } from '../voucher.helper-parent';
import { CreateVoucherDto, ListVoucherDto, UpdateVoucherDto } from './dto';
import { ILike, Not } from 'typeorm';
import { VoucherRepository, PurchaseRepository } from 'src/module-repository/repository';

@Injectable()
export class VoucherServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private readonly voucherRepository: VoucherRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async getList(query: ListVoucherDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.code = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    const list = await this.voucherRepository.findWithPaginate({
      conditions,
      pagination,

      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.voucherRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.VOUCHER_NOT_FOUND);

    return getById;
  }

  async create(body: CreateVoucherDto) {
    const getByName = await this.voucherRepository.findOneByParams({ conditions: { code: body.code } });
    if (getByName) throw new BadRequestException(`${EnumResponseError.VOUCHER_EXIST} với mã ${body.code}`);

    const result = await this.voucherRepository.saveWithoutTransaction({ ...body, remainingQuantity: body.quantity });

    return result;
  }

  async updateById(id: string, body: UpdateVoucherDto) {
    const getById = await this.voucherRepository.findOneByParams({ conditions: { id } });
    if (!getById) throw new BadRequestException(EnumResponseError.VOUCHER_NOT_FOUND);

    const isUsedAtLeastOneTimeVoucher = await this.purchaseRepository.findOneByParams({ conditions: { voucherId: getById.id } });
    if (isUsedAtLeastOneTimeVoucher && (getById.code !== body.code || getById.startDate !== body.startDate)) {
      throw new BadRequestException(`Mã giảm giá đã được sử dụng. Không thể chỉnh sửa mã giảm giá`);
    }

    // chưa dùng mã giảm giá

    if (body.code !== getById.code) {
      const isExist = await this.voucherRepository.findOneByParams({ conditions: { id: Not(getById.id), code: body.code } });
      if (isExist) throw new BadRequestException(`${EnumResponseError.VOUCHER_EXIST} với mã ${body.code}`);
    }

    const paramUpdate = _.pick(body, ['code', 'startDate', 'endDate', 'description', 'status', 'discountUnit', 'discountValue']);

    if (body.quantity !== getById.quantity) {
      paramUpdate.quantity = body.quantity;
      paramUpdate.remainingQuantity = body.quantity;
    }

    await this.voucherRepository.typeOrm.update({ id }, paramUpdate);

    return await this.getById(id);
  }
}
