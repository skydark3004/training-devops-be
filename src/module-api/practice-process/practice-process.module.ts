import { Module } from '@nestjs/common';

import { HelperParent } from './practice-process.helper-parent';
import { PracticeProcessControllerMobile } from './mobile/practice-process.controller';
import { PracticeProcessServiceMobile } from './mobile/practice-process.service';

@Module({
  imports: [],
  controllers: [PracticeProcessControllerMobile],
  providers: [HelperParent, PracticeProcessServiceMobile],
  exports: [PracticeProcessServiceMobile],
})
export class PracticeProcessModule {}
