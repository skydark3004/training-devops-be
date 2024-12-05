import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListNutritionDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;

  @IsOptional()
  @IsUUID()
  categoryId: string;
}
