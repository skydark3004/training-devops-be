import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { DurationUnitEnum, StatusEnum } from 'src/core/enum';

export class ListPackageDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsEnum(DurationUnitEnum)
  durationUnit: DurationUnitEnum;

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

  @IsEnum(StatusEnum)
  status: StatusEnum;
}

export class UpdatePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsEnum(DurationUnitEnum)
  durationUnit: DurationUnitEnum;

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

  @IsEnum(StatusEnum)
  status: StatusEnum;
}
