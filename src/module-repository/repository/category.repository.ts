import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { CategoryEntity } from 'src/core/entity';
import { APP_CONFIG } from 'src/configs/app.config';

@Injectable()
export class CategoryRepository extends CommonRepository<CategoryEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(CategoryEntity, dataSource);
  }

  convertThumbnail(data: CategoryEntity | CategoryEntity[]) {
    if (Array.isArray(data)) {
      return convertThumbnailWithArray(data);
    } else {
      return convertThumbnailWithSingle(data);
    }
  }
}

const convertThumbnailWithArray = (data: CategoryEntity[]) => {
  return data.map((el) => convertThumbnailWithSingle(el));
};

const convertThumbnailWithSingle = (data: CategoryEntity) => {
  const convertNutritions =
    data?.nutritions?.map((nutrition) => {
      return { ...nutrition, pathThumbnailToPreview: convertFullPathToPreview(nutrition.pathThumbnail) };
    }) || [];
  const result = { ...data };
  if (convertNutritions.length) {
    result.nutritions = convertNutritions;
  }
  return result;
};

const convertFullPathToPreview = (path: string) => (path ? `${APP_CONFIG.ENV.STORAGE.DOMAIN}/${path}` : path);
