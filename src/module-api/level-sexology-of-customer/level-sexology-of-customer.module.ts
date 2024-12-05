import { Module } from '@nestjs/common';

import { LevelOfCustomerHelper } from './level-sexology-of-customer.helper';
import { LevelSexologyOfCustomerServiceMobile } from './mobile/level-sexology-of-customer.service';
import { LevelSexologyOfCustomerControllerMobile } from './mobile/level-sexology-of-customer.controller';

@Module({
  imports: [],
  controllers: [LevelSexologyOfCustomerControllerMobile],
  providers: [LevelOfCustomerHelper, LevelSexologyOfCustomerServiceMobile],
  exports: [LevelSexologyOfCustomerServiceMobile],
})
export class LevelSexologyOfCustomerModule {}
