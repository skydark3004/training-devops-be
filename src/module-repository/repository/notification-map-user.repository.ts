import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { NotificationMapUserEntity } from 'src/core/entity';

@Injectable()
export class NotificationMapUserRepository extends CommonRepository<NotificationMapUserEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(NotificationMapUserEntity, dataSource);
  }
}
