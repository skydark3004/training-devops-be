import { IsBoolean, IsEnum, IsNumber, IsString, Length, Matches, Max, Min } from 'class-validator';
import { EnumDiscountUnit } from 'src/core/enum';
import { IsDateFormatString } from 'src/validators';

export class UpdateVoucherDto {
  @IsString()
  @Length(1, 15, { message: 'Tối đa 15 ký tự' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Chỉ cho phép chữ và số, không được có dấu cách',
  })
  code: string;

  @IsNumber()
  @Min(1)
  @Max(999)
  quantity: number;

  @IsDateFormatString()
  startDate: string;

  @IsDateFormatString()
  endDate: string;

  @IsString()
  description: string;

  @IsBoolean()
  status: boolean;

  @IsEnum(EnumDiscountUnit)
  discountUnit: EnumDiscountUnit;

  @IsNumber()
  @Min(0)
  discountValue: number;
}
