import { Module } from '@nestjs/common';

import { TipServiceAdmin } from './admin/tip.service';
import { TipControllerAdmin } from './admin/tip.controller';
import { HelperParent } from './tip.helper-parent';
import { TipControllerMobile } from './mobile/tip.controller';
import { TipServiceMobile } from './mobile/tip.service';

@Module({
  imports: [],
  controllers: [TipControllerAdmin, TipControllerMobile],
  providers: [TipServiceAdmin, HelperParent, TipServiceMobile],
  exports: [TipServiceAdmin, TipServiceMobile],
})
export class TipModule {}
