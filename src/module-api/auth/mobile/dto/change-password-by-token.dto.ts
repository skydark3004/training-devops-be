import { IsString } from 'class-validator';

export class ChangePasswordByTokenDto {
  @IsString()
  token: string;

  @IsString()
  password: string;

  @IsString()
  passwordConfirm: string;
}
