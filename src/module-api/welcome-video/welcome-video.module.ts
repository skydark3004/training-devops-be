import { Module } from '@nestjs/common';

import { WelcomeVideoServiceAdmin } from './admin/welcome-video.service';
import { WelcomeVideoControllerAdmin } from './admin/welcome-video.controller';
import { HelperParent } from './welcome-video.helper-parent';
import { WelcomeVideoControllerMobile } from './mobile/welcome-video.controller';
import { WelcomeVideoServiceMobile } from './mobile/welcome-video.service';

@Module({
  imports: [],
  controllers: [WelcomeVideoControllerAdmin, WelcomeVideoControllerMobile],
  providers: [WelcomeVideoServiceAdmin, HelperParent, WelcomeVideoServiceMobile],
  exports: [WelcomeVideoServiceAdmin, WelcomeVideoServiceMobile],
})
export class WelcomeVideoModule {}
