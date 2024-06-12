import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ResponseErrorEnum } from './package.enum';
import { PackageHelper } from './package.helper';
import { CreatePackageDto, ListPackageDto, UpdatePackageDto } from './package.dto';
import { PackageRepository } from 'src/module-repository/repository';
import { ILike } from 'typeorm';
import { DiscountUnitEnum } from 'src/core/enum';

@Injectable()
export class PackageService {
  constructor(
    private helper: PackageHelper,
    private readonly packageRepository: PackageRepository,
  ) {}

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
    const getById = await this.packageRepository.findOneBy({ id });
    if (!getById) throw new BadRequestException(ResponseErrorEnum.PACKAGE_NOT_FOUND);

    return getById;
  }

  async create(body: CreatePackageDto) {
    const getByName = await this.packageRepository.findOneBy({ name: body.name });
    if (getByName) throw new BadRequestException(`${ResponseErrorEnum.PACKAGE_EXIST} với tên ${body.name}`);

    const priceAfterDiscount = this.helper.calculatePriceWithDiscount({
      price: body.originalPrice,
      discountUnit: DiscountUnitEnum.PERCENT,
      discountValue: body.discountValue,
    });

    const paramsToCreate: any = {
      ...body,
      priceAfterDiscount,
    };

    const entity = this.packageRepository.create(paramsToCreate);
    const create = await this.packageRepository.save(entity);

    return create;
  }

  async updateById(id: string, body: UpdatePackageDto) {
    const getById = await this.packageRepository.findOneBy({ id });
    if (!getById) throw new BadRequestException(ResponseErrorEnum.PACKAGE_NOT_FOUND);

    const getByName = await this.packageRepository.findOneBy({ name: body.name });
    if (getByName && getById.id !== getByName.id) throw new BadRequestException(`${ResponseErrorEnum.PACKAGE_EXIST} với tên ${body.name}`);

    const priceAfterDiscount = this.helper.calculatePriceWithDiscount({
      price: body.originalPrice,
      discountUnit: DiscountUnitEnum.PERCENT,
      discountValue: body.discountValue,
    });

    const paramsToUpdate: any = {
      ...body,
      priceAfterDiscount,
    };

    await this.packageRepository.update({ id }, paramsToUpdate);
    const result = await this.packageRepository.findOneBy({ id });

    return result;
  }
}
