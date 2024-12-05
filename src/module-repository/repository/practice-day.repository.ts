import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { PracticeDayEntity } from 'src/core/entity';

@Injectable()
export class PracticeDayRepository extends CommonRepository<PracticeDayEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(PracticeDayEntity, dataSource);
  }
}
