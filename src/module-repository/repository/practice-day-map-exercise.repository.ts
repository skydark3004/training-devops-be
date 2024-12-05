import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { PracticeDayMapExerciseEntity } from 'src/core/entity';

@Injectable()
export class PracticeDayMapExerciseRepository extends CommonRepository<PracticeDayMapExerciseEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(PracticeDayMapExerciseEntity, dataSource);
  }
}
