import { Module } from '@nestjs/common';

import { UserServiceAdmin } from './admin/user.service';
import { UserControllerAdmin } from './admin/user.controller';
import { UserHelper } from './user.helper';
import { UserControllerMobile } from './mobile/user.controller';
import { UserServiceMobile } from './mobile/user.service';

@Module({
  imports: [],
  controllers: [UserControllerAdmin, UserControllerMobile],
  providers: [UserServiceAdmin, UserHelper, UserServiceMobile],
  exports: [UserServiceAdmin, UserServiceMobile],
})
export class UserModule {}
