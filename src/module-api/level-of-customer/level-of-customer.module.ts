import { Module } from '@nestjs/common';

import { LevelOfCustomerHelper } from './level-of-customer.helper';
import { LevelOfCustomerServiceMobile } from './mobile/level-of-customer.service';
import { LevelOfCustomerControllerMobile } from './mobile/level-of-customer.controller';

@Module({
  imports: [],
  controllers: [LevelOfCustomerControllerMobile],
  providers: [LevelOfCustomerHelper, LevelOfCustomerServiceMobile],
  exports: [LevelOfCustomerServiceMobile],
})
export class LevelOfCustomerModule {}
