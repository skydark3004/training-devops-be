import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumTypeOfFaq } from 'src/core/enum';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListFaqDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;

  @IsOptional()
  @IsEnum(EnumTypeOfFaq)
  type: EnumTypeOfFaq;
}
