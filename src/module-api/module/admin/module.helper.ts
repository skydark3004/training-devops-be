import { Injectable } from '@nestjs/common';
import { EnumDiscountUnit } from 'src/core/enum';

@Injectable()
export class ModuleHelper {
  constructor() {}

  calculatePriceWithDiscount(dataInput: { price: number; discountValue: number; discountUnit: EnumDiscountUnit }) {
    const { price, discountValue, discountUnit } = dataInput;
    if (discountUnit === EnumDiscountUnit.DIRECT_PRICE) {
      return price - discountValue;
    }

    if (discountUnit === EnumDiscountUnit.PERCENT) {
      const discountPrice = price * (discountValue / 100);
      return price - discountPrice;
    }
  }
}
