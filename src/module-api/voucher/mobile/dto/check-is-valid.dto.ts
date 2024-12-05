import { IsString } from 'class-validator';

export class CheckIsValidDto {
  @IsString()
  voucherCode: string;
}
