import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { EnumResponseError } from '../package.enum';
import { ListPackageDto, PurchasePackageByBankDto, SubscribeByPackageIdDto } from './dto';
import { EntityManager, ILike } from 'typeorm';
import { ConfigRepository, PurchaseRepository, PackageRepository, VoucherRepository } from 'src/module-repository/repository';
import { PurchaseEntity, VoucherEntity } from 'src/core/entity';
import moment from 'moment';
import { EnumDiscountUnit, EnumDurationUnit, EnumStatusOfPurchase, EnumTypeOfPurchase } from 'src/core/enum';
import { generateQrCode, generateTransactionCode } from 'src/common';

@Injectable()
export class PackageServiceMobile {
  constructor(
    private readonly packageRepository: PackageRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly voucherRepository: VoucherRepository,
    private readonly configRepository: ConfigRepository,
  ) {}

  async getList(query: ListPackageDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = { status: true };
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }

    const list = await this.packageRepository.findWithPaginate({ conditions, pagination });

    return list;
  }

  async getAll() {
    const list = await this.packageRepository.findAllByParams({ conditions: { status: true } });

    return list;
  }

  async getById(id: string) {
    const getById = await this.packageRepository.typeOrm.findOneBy({ id, status: true });
    if (!getById) throw new BadRequestException(EnumResponseError.PACKAGE_NOT_FOUND);

    return getById;
  }

  async subscribeByPackageId(packageId: string, body: SubscribeByPackageIdDto, userId: string) {
    const getById = await this.packageRepository.typeOrm.findOneBy({ id: packageId, status: true });
    if (!getById) throw new BadRequestException(EnumResponseError.PACKAGE_NOT_FOUND);

    const currentSubscribePackge = await this.purchaseRepository.findOneByParams({
      conditions: { userId, isUseNow: true },
      relations: { package: true },
    });

    const currentDateInTimeZoneVn = moment().tz('UTC').add(7, 'hours');
    const durationUnit = getById.durationUnit === EnumDurationUnit.DAY ? 'days' : 'months';

    let activatedAt = currentDateInTimeZoneVn.format('YYYY-MM-DD');
    let expiredAt = currentDateInTimeZoneVn.add(getById.durationValue, durationUnit).format('YYYY-MM-DD');

    if (currentSubscribePackge) {
      activatedAt = moment(currentSubscribePackge.expiredAt).tz('UTC').add(7, 'hours').add(1, 'days').format('YYYY-MM-DD');
      expiredAt = moment(activatedAt).tz('UTC').add(7, 'hours').add(getById.durationValue, durationUnit).format('YYYY-MM-DD');
    }

    const result = await this.purchaseRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawPurchaseRepo = entityManager.getRepository(PurchaseEntity);

      return await rawPurchaseRepo.save(
        {
          packageId: packageId,
          userId: userId,
          activatedAt,
          expiredAt,
          isUseNow: true,
          transactionId: body.transactionId,
          platform: body.platform,
          type: EnumTypeOfPurchase.IN_APP,
          finalPrice: getById.priceAfterDiscount,
          statusOfPurchase: EnumStatusOfPurchase.COMPLETED,
        },
        { transaction: false },
      );
    });

    return result;
  }

  async purchasedByBank(packageId: string, body: PurchasePackageByBankDto, userId: string) {
    const [getById, purchaseWaitForConfirm, currentSubscribePackge, bankInfor] = await Promise.all([
      this.packageRepository.typeOrm.findOneBy({ id: packageId, status: true }),
      this.purchaseRepository.findOneByParams({
        conditions: { userId, statusOfPurchase: EnumStatusOfPurchase.CUSTOMER_CONFIRMED },
        relations: { package: true },
      }),
      this.purchaseRepository.findOneByParams({
        conditions: { userId, isUseNow: true },
        relations: { package: true },
      }),
      this.configRepository.getBankInformation(),
    ]);

    if (!getById) throw new BadRequestException(EnumResponseError.PACKAGE_NOT_FOUND);

    if (purchaseWaitForConfirm) {
      throw new BadRequestException(`Bạn đã thanh toán gói ${purchaseWaitForConfirm.package.name}. Vui lòng chờ QTV xác nhận thanh toán`);
    }

    if (currentSubscribePackge) {
      throw new BadRequestException(`Bạn đã đăng ký gói ${currentSubscribePackge.package.name}. Không thể đăng ký khi gói chưa hết hạn`);
    }

    let voucher: VoucherEntity;
    if (body.voucherCode) {
      voucher = await this.voucherRepository.findOneByParams({ conditions: { code: body.voucherCode } });
      if (!voucher) throw new BadRequestException('Mã giảm giá không hợp lệ');
      if (voucher.remainingQuantity === 0) {
        throw new BadRequestException('Mã giảm giá đã có số lượt dùng tối đa');
      }

      const formatStartDate = moment(voucher.startDate).add(7, 'hours');
      const formatEndDate = moment(voucher.endDate).add(7, 'hours');

      const isInRange = moment().tz('UTC').add(7, 'hours').isBetween(formatStartDate, formatEndDate, undefined, '[]'); // '[]' để bao gồm startDate và endDate

      if (!isInRange) {
        throw new BadRequestException(
          `Mã giảm giá chỉ được sử dụng từ ngày ${formatStartDate.format('DD-MM-YYYY')} - ${formatEndDate.format('DD-MM-YYYY')}`,
        );
      }
    }

    const result = await this.purchaseRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawPurchaseRepo = entityManager.getRepository(PurchaseEntity);
      const rawVoucherRepo = entityManager.getRepository(VoucherEntity);

      const currentDateInTimeZoneVn = moment().tz('UTC').add(7, 'hours');
      const durationUnit = getById.durationUnit === EnumDurationUnit.DAY ? 'days' : 'months';

      let discountPrice = 0;
      let finalPrice = getById.priceAfterDiscount;
      if (body.voucherCode) {
        const inforDiscountAmount = this.getFinalPrice(getById.priceAfterDiscount, voucher);
        finalPrice = inforDiscountAmount.finalPrice;
        discountPrice = inforDiscountAmount.discountPrice;
        await rawVoucherRepo.update({ id: voucher.id }, { usedQuantity: voucher.usedQuantity + 1, remainingQuantity: voucher.remainingQuantity - 1 });
      }

      const transactionCode = await this.generateTransactionCode();

      const linkQr = generateQrCode({
        bankId: bankInfor.bankId,
        accountNumber: bankInfor.accountNumber,
        ammountMoney: finalPrice,
        description: transactionCode,
        accountName: bankInfor.accountName,
      });

      const purchasePackage = await rawPurchaseRepo.save({
        packageId: packageId,
        userId: userId,
        activatedAt: currentDateInTimeZoneVn.format('YYYY-MM-DD'),
        expiredAt: currentDateInTimeZoneVn.add(getById.durationValue, durationUnit).format('YYYY-MM-DD'),
        isUseNow: false,
        transactionId: transactionCode,
        type: EnumTypeOfPurchase.BANK_TRANSFER,
        finalPrice,
        discountPrice,
        statusOfPurchase: EnumStatusOfPurchase.WAIT_CUSTOMER_CONFIRM,
      });

      return { ...purchasePackage, linkQr, package: getById };
    });

    return result;
  }

  async previewOrderWhenPurchaseByBank(packageId: string, body: PurchasePackageByBankDto, userId: string) {
    const [getById, purchaseWaitForConfirm, currentSubscribePackge, bankInfor] = await Promise.all([
      this.packageRepository.typeOrm.findOneBy({ id: packageId, status: true }),
      this.purchaseRepository.findOneByParams({
        conditions: { userId, statusOfPurchase: EnumStatusOfPurchase.CUSTOMER_CONFIRMED },
        relations: { package: true },
      }),
      this.purchaseRepository.findOneByParams({
        conditions: { userId, isUseNow: true },
        relations: { package: true },
      }),
      this.configRepository.getBankInformation(),
    ]);

    if (!getById) throw new BadRequestException(EnumResponseError.PACKAGE_NOT_FOUND);

    if (purchaseWaitForConfirm) {
      throw new BadRequestException(`Bạn đã thanh toán gói ${purchaseWaitForConfirm.package.name}. Vui lòng chờ QTV xác nhận thanh toán`);
    }

    if (currentSubscribePackge) {
      throw new BadRequestException(`Bạn đã đăng ký gói ${currentSubscribePackge.package.name}. Không thể đăng ký khi gói chưa hết hạn`);
    }

    let voucher: VoucherEntity;
    if (body.voucherCode) {
      voucher = await this.voucherRepository.findOneByParams({ conditions: { code: body.voucherCode } });
      if (!voucher) throw new BadRequestException('Mã giảm giá không hợp lệ');
      if (voucher.remainingQuantity === 0) {
        throw new BadRequestException('Mã giảm giá đã có số lượt dùng tối đa');
      }

      const formatStartDate = moment(voucher.startDate).add(7, 'hours');
      const formatEndDate = moment(voucher.endDate).add(7, 'hours');

      const isInRange = moment().tz('UTC').add(7, 'hours').isBetween(formatStartDate, formatEndDate, undefined, '[]'); // '[]' để bao gồm startDate và endDate

      if (!isInRange) {
        throw new BadRequestException(
          `Mã giảm giá chỉ được sử dụng từ ngày ${formatStartDate.format('DD-MM-YYYY')} - ${formatEndDate.format('DD-MM-YYYY')}`,
        );
      }
    }

    const currentDateInTimeZoneVn = moment().tz('UTC').add(7, 'hours');
    const durationUnit = getById.durationUnit === EnumDurationUnit.DAY ? 'days' : 'months';

    let discountPrice = 0;
    let finalPrice = getById.priceAfterDiscount;
    if (body.voucherCode) {
      const inforDiscountAmount = this.getFinalPrice(getById.priceAfterDiscount, voucher);
      finalPrice = inforDiscountAmount.finalPrice;
      discountPrice = inforDiscountAmount.discountPrice;
    }

    const transactionCode = await this.generateTransactionCode();

    const linkQr = generateQrCode({
      bankId: bankInfor.bankId,
      accountNumber: bankInfor.accountNumber,
      ammountMoney: finalPrice,
      description: transactionCode,
      accountName: bankInfor.accountName,
    });

    const purchasePackage = {
      packageId: packageId,
      userId: userId,
      activatedAt: currentDateInTimeZoneVn.format('YYYY-MM-DD'),
      expiredAt: currentDateInTimeZoneVn.add(getById.durationValue, durationUnit).format('YYYY-MM-DD'),
      isUseNow: false,
      transactionId: transactionCode,
      type: EnumTypeOfPurchase.BANK_TRANSFER,
      finalPrice,
      discountPrice,
      statusOfPurchase: EnumStatusOfPurchase.WAIT_CUSTOMER_CONFIRM,
    };

    return { ...purchasePackage, linkQr, package: getById };
  }

  private getFinalPrice(price: number, voucher: VoucherEntity) {
    if (voucher.discountUnit === EnumDiscountUnit.DIRECT_PRICE) {
      let finalPrice = price - voucher.discountValue;
      if (finalPrice < 0) {
        finalPrice = 0;
      }
      return { finalPrice, discountPrice: voucher.discountValue };
    }

    if (voucher.discountUnit === EnumDiscountUnit.PERCENT) {
      const discountPrice = (price * voucher.discountValue) / 100;
      return { finalPrice: price - discountPrice, discountPrice };
    }
  }

  private async generateTransactionCode() {
    const transactionCode = generateTransactionCode();
    const isExist = await this.purchaseRepository.typeOrm.exists({ where: { transactionId: transactionCode } });
    if (isExist) return await this.generateTransactionCode();

    return transactionCode;
  }
}
