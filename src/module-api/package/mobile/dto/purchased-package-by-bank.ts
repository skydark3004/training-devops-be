import { IsOptional, IsString } from 'class-validator';

export class PurchasePackageByBankDto {
  @IsString()
  @IsOptional()
  voucherCode: string;
}
