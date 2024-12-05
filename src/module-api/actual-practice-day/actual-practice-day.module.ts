import { Module } from '@nestjs/common';

import { HelperParent } from './actual-practice-day.helper';
import { ActualPracticeDayControllerMobile } from './mobile/actual-practice-day.controller';
import { ActualPracticeDayServiceMobile } from './mobile/actual-practice-day.service';

@Module({
  imports: [],
  controllers: [ActualPracticeDayControllerMobile],
  providers: [HelperParent, ActualPracticeDayServiceMobile],
  exports: [ActualPracticeDayServiceMobile],
})
export class ActualPracticeDayModule {}
