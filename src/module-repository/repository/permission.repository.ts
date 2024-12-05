import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { PermissionEntity } from 'src/core/entity/permission.entity';

@Injectable()
export class PermissionRepository extends CommonRepository<PermissionEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(PermissionEntity, dataSource);
  }
}
