import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { VietQrWebhookEntity } from 'src/core/entity';

@Injectable()
export class VietQrWebhookRepository extends CommonRepository<VietQrWebhookEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(VietQrWebhookEntity, dataSource);
  }
}
