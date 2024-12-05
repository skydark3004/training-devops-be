import { Controller, Post, Body, BadRequestException } from '@nestjs/common';

import { AuthServiceMobile } from './auth.service';

import { ChangePasswordByTokenDto, ForgotPasswordDto, LoginDto, VerifyOtpDto } from './dto';
import { RegisterUserDto } from './dto/register-user.dto';
@Controller('/mobile/auth')
export class AuthControllerMobile {
  constructor(private authServiceMobile: AuthServiceMobile) {}

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    const response = await this.authServiceMobile.register(body);
    return response;
  }

  @Post('/generate-token')
  async genToken(@Body() body: any) {
    const response = await this.authServiceMobile.genToken(body);
    return response;
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const response = await this.authServiceMobile.verifyOtp(body);
    return response;
  }

  @Post('/change-password-by-token')
  async changePasswordByToken(@Body() body: ChangePasswordByTokenDto) {
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException('Mật khẩu không khớp');
    }
    const response = await this.authServiceMobile.changePasswordByToken(body);
    return response;
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const response = await this.authServiceMobile.login(body);
    return response;
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const response = await this.authServiceMobile.forgotPassword(body);
    return response;
  }
}
