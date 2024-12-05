import { IsString, IsEnum, ValidateIf } from 'class-validator';
import { EnumTypeRegisterUser } from 'src/core/enum/type.enum';
import { IsVietnamesePhoneNumber } from 'src/validators/is-vietnamese-phone-number';

export class RegisterUserDto {
  @IsString()
  @ValidateIf((object) => object.type === EnumTypeRegisterUser.OTP)
  fullName: string;

  @IsVietnamesePhoneNumber()
  @IsString()
  @ValidateIf((object) => object.type === EnumTypeRegisterUser.OTP)
  phoneNumber: string;

  @IsEnum(EnumTypeRegisterUser)
  type: EnumTypeRegisterUser;

  @IsString()
  @ValidateIf((object) => object.type === EnumTypeRegisterUser.ANONYMOUS)
  anonymousId: string;
}
