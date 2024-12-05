import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EnumRoleCode } from 'src/core/enum';
import { IsVietnamesePhoneNumber } from 'src/validators/is-vietnamese-phone-number';

export class CreateEmployeeDto {
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
