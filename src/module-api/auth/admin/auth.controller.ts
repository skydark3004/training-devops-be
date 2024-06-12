import { Controller, Post, Body } from '@nestjs/common';

import { AuthServiceAdmin } from './auth.service';
import { LoginDto } from './auth.dto';
@Controller('/admin/auth')
export class AuthControllerAdmin {
  constructor(private authServiceAdmin: AuthServiceAdmin) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const response = await this.authServiceAdmin.login(body);
    return response;
  }
}
