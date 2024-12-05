import { Module } from '@nestjs/common';

import { HelperParent } from './actual-practice-sexology-exercise.helper';
import { ActualPracticeSexologyExerciseControllerMobile } from './mobile/actual-practice-sexology-exercise.controller';
import { ActualPracticeSexologyExerciseServiceMobile } from './mobile/actual-practice-sexology-exercise.service';

@Module({
  imports: [],
  controllers: [ActualPracticeSexologyExerciseControllerMobile],
  providers: [HelperParent, ActualPracticeSexologyExerciseServiceMobile],
  exports: [ActualPracticeSexologyExerciseServiceMobile],
})
export class ActualPracticeSexologyExerciseModule {}
