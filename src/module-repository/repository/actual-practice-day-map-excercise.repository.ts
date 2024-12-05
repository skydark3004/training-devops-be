import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { ActualPracticeDayMapExerciseEntity } from 'src/core/entity';

@Injectable()
export class ActualPracticeDayMapExerciseRepository extends CommonRepository<ActualPracticeDayMapExerciseEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(ActualPracticeDayMapExerciseEntity, dataSource);
  }
}
