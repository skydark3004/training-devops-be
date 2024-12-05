import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';
import { PackageEntity } from './package.entity';
import { VoucherEntity } from './voucher.entity';
import { EnumStatusOfPurchase, EnumTypeOfPurchase } from '../enum';

@Entity('purchase')
export class PurchaseEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false, comment: 'ID của gói' })
  packageId: string;

  @Column({ type: 'uuid', nullable: false, comment: 'ID của khách hàng' })
  userId: string;

  @Column({ type: 'date', nullable: false })
  activatedAt: string;

  @Column({ type: 'date', nullable: false })
  expiredAt: string;

  @Column({ type: 'text', nullable: true, default: null, comment: 'Transaction ID khi KH thanh toán qua store' })
  @Index({ unique: true })
  transactionId: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  voucherId: string;

  @Column({ type: 'text', nullable: true, default: null, comment: 'Chỉ dành cho thanh toán in app' })
  platform: string;

  @Column({ type: 'boolean', nullable: false, comment: 'Đang sử dụng gói này để học?' })
  isUseNow: boolean;

  @Column({ type: 'enum', enum: EnumTypeOfPurchase, nullable: true, comment: 'loại thanh toán' })
  type: EnumTypeOfPurchase;

  @Column({ type: 'float', nullable: true, default: null })
  finalPrice: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  discountPrice: number;

  @Column({ type: 'enum', enum: EnumStatusOfPurchase, nullable: true, comment: 'loại thanh toán' })
  statusOfPurchase: EnumStatusOfPurchase;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null, comment: 'VQR4ad410078f 5NGJRMJX2911' })
  contentByVietQr: string;

  /* relations */

  @ManyToOne(() => UserEntity, (entity) => entity.listPurchases, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PackageEntity, (entity) => entity.purchase, { nullable: false })
  @JoinColumn({ name: 'packageId' })
  package: PackageEntity;

  @ManyToOne(() => VoucherEntity, (entity) => entity, { nullable: true })
  @JoinColumn({ name: 'voucherId' })
  voucher: VoucherEntity;
}
