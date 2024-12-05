import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from '../package.enum';
import { PackageHelper } from './package.helper';
import { CreatePackageDto, ListPackageDto, UpdatePackageDto } from './package.dto';
import { PackageRepository } from 'src/module-repository/repository';
import { ILike, IsNull } from 'typeorm';
import { EnumDiscountUnit, EnumDurationUnit, EnumPriceUnit } from 'src/core/enum';

@Injectable()
export class PackageService {
  constructor(
    private helper: PackageHelper,
    private readonly packageRepository: PackageRepository,
  ) {}

  /*   async seed() {
    const data: any = [
      {
        name: 'Gói Thanh toán Store 1',
        description: 'Gói Thanh toán Store 1',
        durationUnit: EnumDurationUnit.DAY,
        durationValue: 7,
        originalPrice: 1000000, //1tr
        discountUnit: EnumDiscountUnit.PERCENT,
        discountValue: 10,
        priceAfterDiscount: 900000,
        priceUnit: EnumPriceUnit.VND,
        isShowDiscount: true,
        storeId: 'N01',
        status: true,
      },
      {
        name: 'Gói Thanh toán Store 2',
        description: 'Gói Thanh toán Store 2',
        durationUnit: EnumDurationUnit.DAY,
        durationValue: 7,
        originalPrice: 1000000, //1tr
        discountUnit: EnumDiscountUnit.PERCENT,
        discountValue: 50,
        priceAfterDiscount: 500000,
        priceUnit: EnumPriceUnit.VND,
        isShowDiscount: true,
        storeId: 'N02',
        status: true,
      },
    ];
    await this.packageRepository.typeOrm.upsert(data, { skipUpdateIfNoValuesChanged: true, conflictPaths: ['storeId'] });
  } */

  async getList(query: ListPackageDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }
    if (query.status) {
      conditions.status = query.status;
    }

    const list = await this.packageRepository.findWithPaginate({ conditions, pagination });

    return list;
  }

  async getById(id: string) {
    const getById = await this.packageRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.PACKAGE_NOT_FOUND);

    return getById;
  }

  async create(body: CreatePackageDto) {
    const getByName = await this.packageRepository.typeOrm.findOneBy({ name: body.name });
    if (getByName) throw new BadRequestException(`${EnumResponseError.PACKAGE_EXIST} với tên ${body.name}`);

    if (body.status === true) {
      const MAX_PACKAGES_TO_ALLOW_ACTIVE = 4;
      const totalActivePackages = await this.packageRepository.typeOrm.count({ where: { status: true } });
      if (totalActivePackages === MAX_PACKAGES_TO_ALLOW_ACTIVE) throw new BadRequestException('Đã kích hoạt tối đa 4 gói đăng ký');
    }

    const priceAfterDiscount = this.helper.calculatePriceWithDiscount({
      price: body.originalPrice,
      discountUnit: EnumDiscountUnit.PERCENT,
      discountValue: body.discountValue,
    });

    const paramsToCreate: any = {
      ...body,
      priceAfterDiscount,
    };

    const entity = this.packageRepository.typeOrm.create(paramsToCreate);
    const create = await this.packageRepository.typeOrm.save(entity);

    return create;
  }

  async updateById(id: string, body: UpdatePackageDto) {
    const getById = await this.packageRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.PACKAGE_NOT_FOUND);

    // không cho off status gói thanh toán vs store
    if (getById.storeId && body.status === false) {
      throw new BadRequestException('Không thể tắt trạng thái của gói thanh toán với store');
    }

    if (getById.status === false && body.status === true) {
      const MAX_PACKAGES_TO_ALLOW_ACTIVE = 4;
      const totalActivePackages = await this.packageRepository.typeOrm.count({ where: { status: true, storeId: IsNull() } });
      if (totalActivePackages === MAX_PACKAGES_TO_ALLOW_ACTIVE) throw new BadRequestException('Đã kích hoạt tối đa 4 gói đăng ký');
    }

    const getByName = await this.packageRepository.typeOrm.findOneBy({ name: body.name });
    if (getByName && getById.id !== getByName.id) throw new BadRequestException(`${EnumResponseError.PACKAGE_EXIST} với tên ${body.name}`);

    const priceAfterDiscount = this.helper.calculatePriceWithDiscount({
      price: body.originalPrice,
      discountUnit: EnumDiscountUnit.PERCENT,
      discountValue: body.discountValue,
    });

    const paramsToUpdate: any = {
      ...body,
      priceAfterDiscount,
    };

    await this.packageRepository.typeOrm.update({ id }, paramsToUpdate);
    const result = await this.packageRepository.typeOrm.findOneBy({ id });

    return result;
  }
}
