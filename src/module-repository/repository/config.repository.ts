import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { EnumConfigCode, ProvideOfProvidersEnum } from 'src/core/enum';
import { ConfigEntity } from 'src/core/entity';
import { IBankInformation, IGoogleSheetConfig } from 'src/core/interfaces';

@Injectable()
export class ConfigRepository extends CommonRepository<ConfigEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(ConfigEntity, dataSource);
  }

  async getBankInformation() {
    const result = await this.findOneByParams({ conditions: { code: EnumConfigCode.INFORMATION_BANK } });

    return result.value as IBankInformation;
  }

  async getSheetInformation() {
    const result = await this.findOneByParams({ conditions: { code: EnumConfigCode.GOOGLE_SHEET } });
    return result.value as IGoogleSheetConfig;
  }
}
