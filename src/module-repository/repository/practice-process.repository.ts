import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { PracticeProcessEntity } from 'src/core/entity';

@Injectable()
export class PracticeProcessRepository extends CommonRepository<PracticeProcessEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(PracticeProcessEntity, dataSource);
  }
}
