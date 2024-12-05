import { Module } from '@nestjs/common';

import { HelperParent } from './actual-practice-exercise.helper';
import { ActualPracticeExerciseControllerMobile } from './mobile/actual-practice-exercise.controller';
import { ActualPracticeExerciseServiceMobile } from './mobile/actual-practice-exercise.service';

@Module({
  imports: [],
  controllers: [ActualPracticeExerciseControllerMobile],
  providers: [HelperParent, ActualPracticeExerciseServiceMobile],
  exports: [ActualPracticeExerciseServiceMobile],
})
export class ActualPracticeExerciseModule {}
