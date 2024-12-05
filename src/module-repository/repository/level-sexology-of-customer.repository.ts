import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { LevelSexologyOfCustomerEntity } from 'src/core/entity';

@Injectable()
export class LevelSexologyOfCustomerRepository extends CommonRepository<LevelSexologyOfCustomerEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(LevelSexologyOfCustomerEntity, dataSource);
  }
}
