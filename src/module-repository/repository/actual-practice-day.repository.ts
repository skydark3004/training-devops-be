import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { ActualPracticeDayEntity } from 'src/core/entity';

@Injectable()
export class ActualPracticeDayRepository extends CommonRepository<ActualPracticeDayEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(ActualPracticeDayEntity, dataSource);
  }
}
