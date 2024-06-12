import { IsOptional } from 'class-validator';
import { ParseNumberString } from 'src/pipe';

export class PaginationDto {
  @IsOptional()
  @ParseNumberString({ isIgnoreIfUndefined: true })
  page?: number;

  @IsOptional()
  @ParseNumberString({ isIgnoreIfUndefined: true })
  pageSize?: number;
}
