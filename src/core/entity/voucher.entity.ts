import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base/base.entity';
import { PurchaseEntity } from '.';
import { EnumDiscountUnit } from '../enum';

@Entity('voucher')
export class VoucherEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  code: string;

  @Column({ nullable: false, type: 'int' })
  quantity: number;

  @Column({ nullable: false, type: 'int', default: 0, comment: 'Số lượng đã dùng' })
  usedQuantity: number;

  @Column({ nullable: false, type: 'int', comment: 'Số lượng còn lại' })
  remainingQuantity: number;

  @Column({ nullable: false, type: 'date' })
  startDate: string;

  @Column({ nullable: false, type: 'date' })
  endDate: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'enum', enum: EnumDiscountUnit, default: EnumDiscountUnit.PERCENT })
  discountUnit: EnumDiscountUnit;

  @Column({ nullable: true, type: 'int', default: 0 })
  discountValue: number;

  /* other fields to handle  */

  @OneToMany(() => PurchaseEntity, (entity) => entity.voucher)
  usedVouchers: PurchaseEntity[];
}
