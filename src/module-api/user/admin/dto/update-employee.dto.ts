import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsVietnamesePhoneNumber } from 'src/validators/is-vietnamese-phone-number';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsVietnamesePhoneNumber()
  phoneNumber: string;

  @IsUUID()
  @IsOptional()
  permissionId: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
