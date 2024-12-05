import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { HistoryReadNutrition } from 'src/core/entity';

@Injectable()
export class HistoryReadNutritionRepository extends CommonRepository<HistoryReadNutrition> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(HistoryReadNutrition, dataSource);
  }
}
