import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity('viet_qr_webhook')
export class VietQrWebhookEntity extends BaseEntity {
  @Column({ nullable: true, type: 'varchar', length: 255 })
  bankaccount: string; // Tài khoản ngân hàng tạo mã thanh toán.

  @Column({ nullable: true, type: 'float' })
  amount: number; // Số tiền giao dịch.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  transType: string; // Phân loại giao dịch là ghi nợ/ghi có (giá trị: D/C).

  @Column({ type: 'text', nullable: true })
  content: string; // Nội dung chuyển tiền.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  transactionid: string; //ID của giao dịch.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  transactiontime: string; // Tem thời gian giao dịch.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  referencenumber: string; // Mã giao dịch.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  orderId: string; // ID của đơn hàng.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  terminalCode: string; // Mã cửa hàng/điểm bán.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  subTerminalCode: string; // Mã cửa hàng phụ/điểm bán phụ.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  serviceCode: string; // Mã sản phẩm/dịch vụ.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  urlLink: string; // Link điều hướng sau khi thanh toán thành công.

  @Column({ nullable: true, type: 'varchar', length: 255 })
  sign: string; // Chữ ký.
}
