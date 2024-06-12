import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { StatusEnum, RoleCodeEnum } from 'src/core/enum';
import { GenderTypesEnum } from 'src/core/enum/type.enum';
import { IsVietnamesePhoneNumber } from 'src/validators/is-vietnamese-phone-number';

export class ListUserDto extends PaginationDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsOptional()
  @IsUUID()
  permissionId: string;

  @IsEnum(RoleCodeEnum)
  @IsOptional()
  roleCode: RoleCodeEnum;
}

export class CreateUserDto {
  @IsString()
  @IsEmail()
  username: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  password: string;

  @IsVietnamesePhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsEnum(GenderTypesEnum)
  gender: GenderTypesEnum;

  @IsEnum(RoleCodeEnum)
  roleCode: RoleCodeEnum;

  @IsUUID()
  permissionId: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsVietnamesePhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(GenderTypesEnum)
  gender: GenderTypesEnum;

  @IsUUID()
  @IsOptional()
  permissionId: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
