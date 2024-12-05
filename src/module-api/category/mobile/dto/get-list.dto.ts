import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/core/dto';

export class ListCategoryDto extends PaginationDto {
  @IsOptional()
  keySearch: string;
}
