import { Column, Entity, OneToMany } from 'typeorm';
import { EnumDiscountUnit, EnumDurationUnit, EnumPriceUnit } from '../enum';
import { BaseEntity } from './base/base.entity';
import { PurchaseEntity } from './package-map-user.entity';

@Entity('package')
export class PackageEntity extends BaseEntity {
  @Column({ nullable: true, type: 'text', unique: true })
  name: string;

  @Column({ nullable: true, type: 'text', default: '' })
  description: string;

  @Column({ nullable: true, type: 'enum', enum: EnumDurationUnit })
  durationUnit: EnumDurationUnit;

  @Column({ nullable: true, type: 'int' })
  durationValue: number;

  @Column({ nullable: true, type: 'float', default: 0 })
  originalPrice: number;

  @Column({ nullable: true, type: 'enum', enum: EnumDiscountUnit, default: EnumDiscountUnit.PERCENT })
  discountUnit: EnumDiscountUnit;

  @Column({ nullable: true, type: 'int', default: 0 })
  discountValue: number;

  @Column({ nullable: true, type: 'float', default: 0 })
  priceAfterDiscount: number;

  @Column({ nullable: true, type: 'enum', enum: EnumPriceUnit, default: EnumPriceUnit.VND })
  priceUnit: EnumPriceUnit;

  @Column({ nullable: true, type: 'boolean' })
  isShowDiscount: boolean;

  @Column({ nullable: true, type: 'text', default: null, unique: true })
  storeId: string;

  /* relations */

  @OneToMany(() => PurchaseEntity, (entity) => entity.package)
  purchase: PurchaseEntity[];

  /*   @OneToMany(() => UsedVoucherEntity, (entity) => entity.package)
  usedVouchers: UsedVoucherEntity[]; */
}
