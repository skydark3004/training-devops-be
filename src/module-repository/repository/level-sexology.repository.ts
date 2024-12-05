import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { LevelSexologyEntity } from 'src/core/entity';

@Injectable()
export class LevelSexologyRepository extends CommonRepository<LevelSexologyEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(LevelSexologyEntity, dataSource);
  }
}
