import { IsOptional, IsString } from 'class-validator';

export class PreviewOrderDto {
  @IsString()
  @IsOptional()
  voucherCode: string;
}
