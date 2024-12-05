import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/core/dto';

export class ListPackageDto extends PaginationDto {
  @IsOptional()
  keySearch: string;
}
