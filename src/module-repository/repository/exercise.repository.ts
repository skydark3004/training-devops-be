import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { ExerciseEntity } from 'src/core/entity';
import { APP_CONFIG } from 'src/configs/app.config';
import { EnumExcerciseType, EnumScreenTypeOfInformation } from 'src/core/enum/type.enum';
import { InformationDto, ReelDto, VideoDto } from 'src/module-api/excercise/admin/dto';

@Injectable()
export class ExerciseRepository extends CommonRepository<ExerciseEntity> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(ExerciseEntity, dataSource);
  }

  convertUrlToPreview(
    data: ExerciseEntity | ExerciseEntity[],
    type: { thumbnail?: boolean; guideVideos?: boolean; details?: boolean },
  ): ExerciseEntity | ExerciseEntity[] {
    if (Array.isArray(data)) {
      return data.map((el) => {
        const thumbnailToPreview = type?.thumbnail ? convertFullPathToPreview(el.thumbnail) : undefined;
        const guideVideosToPreview = type?.guideVideos ? convertGuideVideosToUrl(el.guideVideos) : undefined;
        const details = type?.details ? convertPathInDetails(el) : el.details;
        return { ...el, thumbnailToPreview, guideVideosToPreview, details };
      });
    } else {
      const thumbnailToPreview = type?.thumbnail ? convertFullPathToPreview(data.thumbnail) : undefined;
      const guideVideosToPreview = type?.guideVideos ? convertGuideVideosToUrl(data.guideVideos) : undefined;
      const details = type?.details ? convertPathInDetails(data) : data.details;
      return { ...data, thumbnailToPreview, guideVideosToPreview, details };
    }
  }
}

const convertFullPathToPreview = (path: string) => (path ? `${APP_CONFIG.ENV.STORAGE.DOMAIN}/${path}` : path);
const convertGuideVideosToUrl = (guideVideos: string[]) => guideVideos.map((el) => `${APP_CONFIG.ENV.STORAGE.DOMAIN}/${el}`);

const convertPathInDetails = (data: ExerciseEntity) => {
  if (data.exerciseType === EnumExcerciseType.VIDEO) {
    for (const step of data.details as VideoDto[]) {
      if (step?.path) {
        step.pathToPreview = convertFullPathToPreview(step.path);
      }
    }
  }

  if (data.exerciseType === EnumExcerciseType.REEL) {
    for (const step of data.details as ReelDto[]) {
      step.pathToPreview = convertFullPathToPreview(step.path);
    }
  }

  if (data.exerciseType === EnumExcerciseType.INFORMATION) {
    for (const step of data.details as InformationDto[]) {
      if (step.typeOfScreen === EnumScreenTypeOfInformation.AUDIO) {
        step.imagePathToPreview = convertFullPathToPreview(step.imagePath);
        step.audioPathToPreview = convertFullPathToPreview(step.audioPath);
      }

      if (step.typeOfScreen === EnumScreenTypeOfInformation.FLEXIBLE) {
        step.moreComponents = step.moreComponents.map((component) => {
          return { ...component, imagePathToPreview: convertFullPathToPreview(component.path) };
        });
      }
    }
  }

  return data.details;
};
