import { Injectable } from '@nestjs/common';
import { DiscountUnitEnum } from 'src/core/enum';

@Injectable()
export class PackageHelper {
  constructor() {}

  calculatePriceWithDiscount(dataInput: { price: number; discountValue: number; discountUnit: DiscountUnitEnum }) {
    const { price, discountValue, discountUnit } = dataInput;
    if (discountUnit === DiscountUnitEnum.DIRECT_PRICE) {
      return price - discountValue;
    }

    if (discountUnit === DiscountUnitEnum.PERCENT) {
      const discountPrice = price * (discountValue / 100);
      return price - discountPrice;
    }
  }
}
