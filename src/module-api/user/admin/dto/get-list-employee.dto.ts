import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumRoleCode } from 'src/core/enum';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListEmployeeDto extends PaginationDto {
  @IsString()
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;

  @IsOptional()
  @IsUUID()
  permissionId: string;

  @IsEnum(EnumRoleCode)
  @IsOptional()
  roleCode: EnumRoleCode;
}
