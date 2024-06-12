import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { PermissionEnum, StatusEnum } from 'src/core/enum';
import { ParseJson } from 'src/pipe';

export class ListPermissionDto extends PaginationDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsOptional()
  @ParseJson({ isIgnoreIfUndefined: true })
  permissionCodes?: PermissionEnum[];
}

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  @ArrayMinSize(1)
  @ArrayUnique((value) => value)
  details: PermissionEnum[];

  @IsEnum(StatusEnum)
  status: StatusEnum;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  @ArrayMinSize(1)
  @ArrayUnique((value) => value)
  details: PermissionEnum[];

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
