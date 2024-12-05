import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { PurchaseEntity } from 'src/core/entity';

@Injectable()
export class PurchaseRepository extends CommonRepository<PurchaseEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(PurchaseEntity, dataSource);
  }
}
