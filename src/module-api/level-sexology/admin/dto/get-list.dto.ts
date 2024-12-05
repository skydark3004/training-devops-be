import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListLevelSexologyDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;
}
