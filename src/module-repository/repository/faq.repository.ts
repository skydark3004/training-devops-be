import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { FaqEntity } from 'src/core/entity';
import { APP_CONFIG } from 'src/configs/app.config';

@Injectable()
export class FaqRepository extends CommonRepository<FaqEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(FaqEntity, dataSource);
  }

  convertThumbnail(data: FaqEntity | FaqEntity[]) {
    if (Array.isArray(data)) {
      return data.map((el) => {
        return { ...el, pathThumbnailToPreview: convertFullPathToPreview(el.pathThumbnail) };
      });
    } else {
      return { ...data, pathThumbnailToPreview: convertFullPathToPreview(data.pathThumbnail) };
    }
  }
}

const convertFullPathToPreview = (path: string) => (path ? `${APP_CONFIG.ENV.STORAGE.DOMAIN}/${path}` : path);
