import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumStatusOfPurchase } from 'src/core/enum';

export class ListPurchaseDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @IsEnum(EnumStatusOfPurchase)
  statusOfPurchase: boolean;
}

export class UpdatePurchaseDto {
  @IsEnum(EnumStatusOfPurchase)
  statusOfPurchase: EnumStatusOfPurchase;
}
