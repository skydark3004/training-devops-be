import { ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumPermission } from 'src/core/enum';
import { ParseBooleanStringTrueFalse, ParseJson } from 'src/pipe';

export class ListPermissionDto extends PaginationDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;

  @IsOptional()
  @ParseJson({ isIgnoreIfUndefined: true })
  permissionCodes?: EnumPermission[];
}

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(EnumPermission, { each: true })
  @ArrayMinSize(1)
  @ArrayUnique((value) => value)
  details: EnumPermission[];

  @IsBoolean()
  status: boolean;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsEnum(EnumPermission, { each: true })
  @ArrayMinSize(1)
  @ArrayUnique((value) => value)
  details: EnumPermission[];

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
