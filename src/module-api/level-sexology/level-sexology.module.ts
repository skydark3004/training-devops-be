import { Module } from '@nestjs/common';

import { LevelSexologyServiceAdmin } from './admin/level-sexology.service';
import { LevelSexologyControllerAdmin } from './admin/level-sexology.controller';
import { LevelSexologyHelper } from './level-sexology.helper';
import { LevelSexologyControllerMobile } from './mobile/level-sexology.controller';
import { LevelSexologyServiceMobile } from './mobile/level-sexology.service';

@Module({
  imports: [],
  controllers: [LevelSexologyControllerAdmin, LevelSexologyControllerMobile],
  providers: [LevelSexologyServiceAdmin, LevelSexologyHelper, LevelSexologyServiceMobile],
  exports: [LevelSexologyServiceAdmin, LevelSexologyServiceMobile],
})
export class LevelSexologyModule {}
