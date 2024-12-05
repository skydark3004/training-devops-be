import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumRoleCode } from 'src/core/enum';
//import { EnumGenderTypes } from 'src/core/enum/type.enum';
import { ParseBooleanStringTrueFalse } from 'src/pipe';
import { IsVietnamesePhoneNumber } from 'src/validators/is-vietnamese-phone-number';

export class ListCustomerDto extends PaginationDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

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

export class CreateCustomerDto {
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

  /*   @IsEnum(EnumGenderTypes)
  gender: EnumGenderTypes; */

  @IsEnum(EnumRoleCode)
  roleCode: EnumRoleCode;

  @IsUUID()
  permissionId: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsVietnamesePhoneNumber()
  phoneNumber: string;

  /*   @IsOptional()
  @IsEnum(EnumGenderTypes)
  gender: EnumGenderTypes; */

  @IsUUID()
  @IsOptional()
  permissionId: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
