import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumDurationUnit } from 'src/core/enum';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListPackageDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;
}

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsEnum(EnumDurationUnit)
  durationUnit: EnumDurationUnit;

  @IsNumber()
  @Min(1)
  durationValue: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsBoolean()
  isShowDiscount: boolean;

  @IsBoolean()
  status: boolean;
}

export class UpdatePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsEnum(EnumDurationUnit)
  durationUnit: EnumDurationUnit;

  @IsNumber()
  @Min(1)
  durationValue: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsBoolean()
  isShowDiscount: boolean;

  @IsBoolean()
  status: boolean;
}
