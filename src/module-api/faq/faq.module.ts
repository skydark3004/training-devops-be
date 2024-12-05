import { Module } from '@nestjs/common';

import { FaqServiceAdmin } from './admin/faq.service';
import { FaqControllerAdmin } from './admin/faq.controller';
import { HelperParent } from './faq.helper-parent';
import { FaqControllerMobile } from './mobile/faq.controller';
import { FaqServiceMobile } from './mobile/faq.service';

@Module({
  imports: [],
  controllers: [FaqControllerAdmin, FaqControllerMobile],
  providers: [FaqServiceAdmin, HelperParent, FaqServiceMobile],
  exports: [FaqServiceAdmin, FaqServiceMobile],
})
export class FaqModule {}
