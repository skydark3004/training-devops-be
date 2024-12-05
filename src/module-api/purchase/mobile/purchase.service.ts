import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumResponseError } from '../purchase.enum';
import { ConfigRepository, PurchaseRepository, VoucherRepository } from 'src/module-repository/repository';
import { EnumStatusOfPurchase } from 'src/core/enum';

@Injectable()
export class PurchaseServiceMobile {
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    private readonly voucherRepository: VoucherRepository,
    private readonly configRepository: ConfigRepository,
  ) {}

  async confirmTransfered(purchasedId: string, userId: string) {
    const getById = await this.purchaseRepository.typeOrm.findOne({ where: { id: purchasedId, userId } });
    if (!getById) throw new BadRequestException(EnumResponseError.PURCHASE_NOT_FOUND);

    await this.purchaseRepository.typeOrm.update({ id: purchasedId }, { statusOfPurchase: EnumStatusOfPurchase.CUSTOMER_CONFIRMED });

    return { message: 'Xác nhận đơn hàng thành công. QTV sẽ xác nhận đơn hàng để nâng cấp gói cho bạn!', messageCode: 'CONFIRM_SUCCESS' };
  }
}
