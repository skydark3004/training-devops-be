import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { WelcomeVideoEntity } from 'src/core/entity';
import { convertFullPathToPreview } from 'src/common';

@Injectable()
export class WelcomeVideoRepository extends CommonRepository<WelcomeVideoEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(WelcomeVideoEntity, dataSource);
  }

  convertUrlToPreview(data: WelcomeVideoEntity) {
    return {
      ...data,
      firstToPreview: convertFullPathToPreview(data.first),
      secondToPreview: convertFullPathToPreview(data.second),
      thirdToPreview: convertFullPathToPreview(data.third),
      sexologyToPreview: convertFullPathToPreview(data.sexology),
    };
  }
}
