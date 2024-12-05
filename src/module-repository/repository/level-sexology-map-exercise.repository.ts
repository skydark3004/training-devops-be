import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { LevelSexologyMapExerciseEntity } from 'src/core/entity';

@Injectable()
export class LevelSexologyMapExerciseRepository extends CommonRepository<LevelSexologyMapExerciseEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(LevelSexologyMapExerciseEntity, dataSource);
  }
}
