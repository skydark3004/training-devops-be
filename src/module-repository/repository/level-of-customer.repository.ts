import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { LevelOfCustomerEntity } from 'src/core/entity';

@Injectable()
export class LevelOfCustomerRepository extends CommonRepository<LevelOfCustomerEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(LevelOfCustomerEntity, dataSource);
  }
}
