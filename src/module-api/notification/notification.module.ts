import { Module } from '@nestjs/common';

import { NotificationServiceAdmin } from './admin/notification.service';
import { NotificationControllerAdmin } from './admin/notification.controller';
import { HelperParent } from './notification.helper-parent';
import { NotificationControllerMobile } from './mobile/notfication.controller';
import { NotificationServiceMobile } from './mobile/notification.service';

@Module({
  imports: [],
  controllers: [NotificationControllerAdmin, NotificationControllerMobile],
  providers: [NotificationServiceAdmin, HelperParent, NotificationServiceMobile],
  exports: [NotificationServiceAdmin, NotificationServiceMobile],
})
export class NotificationModule {}
