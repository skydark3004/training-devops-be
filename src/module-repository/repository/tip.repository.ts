import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { TipEntity } from 'src/core/entity';

@Injectable()
export class TipRepository extends CommonRepository<TipEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(TipEntity, dataSource);
  }
}
