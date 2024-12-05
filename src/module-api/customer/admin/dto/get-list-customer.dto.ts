import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListCustomerDto extends PaginationDto {
  @IsString()
  @IsOptional()
  keySearch: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;
}
