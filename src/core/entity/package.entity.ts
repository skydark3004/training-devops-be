import { Column, Entity } from 'typeorm';
import { DiscountUnitEnum, DurationUnitEnum, PriceUnitEnum, StatusEnum } from '../enum';
import { BaseEntity } from './base/base.entity';

@Entity('package')
export class Package extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column({ nullable: true, type: 'text', default: '' })
  description: string;

  @Column({ nullable: false, type: 'enum', enum: DurationUnitEnum })
  durationUnit: DurationUnitEnum;

  @Column({ nullable: false, type: 'int' })
  durationValue: number;

  @Column({ nullable: false, type: 'int' })
  originalPrice: number;

  @Column({ nullable: false, type: 'enum', enum: DiscountUnitEnum, default: DiscountUnitEnum.PERCENT })
  discountUnit: DiscountUnitEnum;

  @Column({ nullable: false, type: 'int', default: 0 })
  discountValue: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  priceAfterDiscount: number;

  @Column({ nullable: false, type: 'enum', enum: PriceUnitEnum, default: PriceUnitEnum.VND })
  priceUnit: PriceUnitEnum;

  @Column({ nullable: false, type: 'boolean' })
  isShowDiscount: boolean;

  @Column({ nullable: false, type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}
