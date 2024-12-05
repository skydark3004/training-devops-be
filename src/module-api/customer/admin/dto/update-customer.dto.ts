import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsVietnamesePhoneNumber } from 'src/validators/is-vietnamese-phone-number';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
