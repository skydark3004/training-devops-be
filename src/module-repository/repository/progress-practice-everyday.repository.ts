import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { ProgressPracticeEveryDayEntity } from 'src/core/entity';

@Injectable()
export class ProgressPracticeEveryDayRepository extends CommonRepository<ProgressPracticeEveryDayEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(ProgressPracticeEveryDayEntity, dataSource);
  }
}
