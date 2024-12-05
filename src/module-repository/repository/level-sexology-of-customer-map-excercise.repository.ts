import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { LevelSexologyOfCustomerMapExerciseEntity } from 'src/core/entity';

@Injectable()
export class LevelSexologyOfCustomerMapExerciseRepository extends CommonRepository<LevelSexologyOfCustomerMapExerciseEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(LevelSexologyOfCustomerMapExerciseEntity, dataSource);
  }
}
