import { Module } from '@nestjs/common';

import { UserService } from './admin/user.service';
import { UserControllerAdmin } from './admin/user.controller';
import { UserHelper } from './admin/user.helper';

@Module({
  imports: [],
  controllers: [UserControllerAdmin],
  providers: [UserService, UserHelper],
  exports: [UserService],
})
export class UserModule {}
