import { Module } from '@nestjs/common';

import { LevelServiceAdmin } from './admin/level.service';
import { LevelControllerAdmin } from './admin/level.controller';
import { LevelHelper } from './level.helper';
import { LevelServiceMobile } from './mobile/level.service';
import { LevelControllerMobile } from './mobile/level.controller';

@Module({
  imports: [],
  controllers: [LevelControllerAdmin, LevelControllerMobile],
  providers: [LevelServiceAdmin, LevelHelper, LevelServiceMobile],
  exports: [LevelServiceAdmin, LevelServiceMobile],
})
export class LevelModule {}
