import { Module } from '@nestjs/common';

import { ExerciseServiceAdmin } from './admin/excercise.service';
import { ExerciseControllerAdmin } from './admin/excercise.controller';
import { HelperParent } from './excercise.helper';
import { HelperAdmin } from './admin/excercise.helper';
import { ExerciseControllerMobile } from './mobile/excercise.controller';
import { ExerciseServiceMobile } from './mobile/excercise.service';

@Module({
  imports: [],
  controllers: [ExerciseControllerAdmin, ExerciseControllerMobile],
  providers: [ExerciseServiceAdmin, HelperParent, HelperAdmin, ExerciseServiceMobile],
  exports: [ExerciseServiceAdmin, ExerciseServiceMobile],
})
export class ExerciseModule {}
