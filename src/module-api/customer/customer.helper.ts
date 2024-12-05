import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

@Injectable()
export class CustomerHelper {
  constructor() {}

  calculateIncrease(first: number, current: number) {
    if (!first || !current) {
      return 0;
    }

    if (first <= current) {
      return 0;
    }

    return new Decimal(first).dividedBy(current).toNumber();
  }

  calculatePercent(value_1: number, value_2: number) {
    if (!value_1 || !value_2) {
      return 0;
    }

    return new Decimal(value_1).dividedBy(value_2).times(100).toNumber();
  }
}
