import { Module } from '@nestjs/common';

import { AuthServiceAdmin } from './admin/auth.service';
import { AuthControllerAdmin } from './admin/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from './auth.helper';
import { AuthControllerMobile } from './mobile/auth.controller';
import { AuthServiceMobile } from './mobile/auth.service';
import { LevelModule } from '../level/level.module';

@Module({
  imports: [JwtModule, LevelModule],
  controllers: [AuthControllerAdmin, AuthControllerMobile],
  providers: [AuthServiceAdmin, AuthHelper, AuthServiceMobile],
  exports: [AuthServiceAdmin],
})
export class AuthModule {}
