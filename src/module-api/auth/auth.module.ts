import { Module } from '@nestjs/common';

import { AuthServiceAdmin } from './admin/auth.service';
import { AuthControllerAdmin } from './admin/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AuthControllerAdmin],
  providers: [AuthServiceAdmin],
  exports: [AuthServiceAdmin],
})
export class AuthModule {}
