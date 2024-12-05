import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { TempFileEntity } from 'src/core/entity';

@Injectable()
export class TempFileRepository extends CommonRepository<TempFileEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(TempFileEntity, dataSource);
  }

  async findByPath(path: string): Promise<TempFileEntity> {
    return await this.findOneByParams({ conditions: { path } });
  }
}
