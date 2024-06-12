import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { Package } from 'src/core/entity';

@Injectable()
export class PackageRepository extends CommonRepository<Package> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(Package, dataSource);
  }
}
