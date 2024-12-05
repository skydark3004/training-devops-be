import { Module } from '@nestjs/common';

import { ConfigServiceAdmin } from './admin/config.service';
import { ConfigControllerAdmin } from './admin/config.controller';
import { HelperParent } from './config.helper-parent';

@Module({
  imports: [],
  controllers: [ConfigControllerAdmin],
  providers: [ConfigServiceAdmin, HelperParent],
  exports: [ConfigServiceAdmin],
})
export class ConfigModule {}
