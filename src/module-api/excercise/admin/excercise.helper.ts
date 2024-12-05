import { Injectable } from '@nestjs/common';
import { EnumExcerciseType, EnumScreenTypeOfInformation, EnumScreenTypeOfVideo, EnumTypeComponentOfFlexibleScreen } from 'src/core/enum/type.enum';
import { InformationDto, MusclePcDto, ReelDto, VideoDto } from './dto';
@Injectable()
export class HelperAdmin {
  constructor() {}

  getAllFilesInAllSteps(data: { exerciseType: EnumExcerciseType; details: MusclePcDto[] | ReelDto[] | VideoDto[] | InformationDto[] }) {
    const { exerciseType, details } = data;
    const listTempFiles: string[] = [];

    switch (exerciseType) {
      case EnumExcerciseType.VIDEO:
        for (const step of details as VideoDto[]) {
          if (step.typeOfScreen === EnumScreenTypeOfVideo.VIDEO) {
            listTempFiles.push(step.path);
          }
        }
        break;

      case EnumExcerciseType.REEL:
        for (const step of details as ReelDto[]) {
          listTempFiles.push(step.path);
        }
        break;

      case EnumExcerciseType.INFORMATION:
        for (const step of details as InformationDto[]) {
          if (step.typeOfScreen === EnumScreenTypeOfInformation.FLEXIBLE) {
            for (const component of step.moreComponents) {
              if (component.type === EnumTypeComponentOfFlexibleScreen.IMAGE) {
                listTempFiles.push(component.path);
              }
            }
          }

          if (step.typeOfScreen === EnumScreenTypeOfInformation.AUDIO) {
            listTempFiles.push(step.audioPath);
            listTempFiles.push(step.imagePath);
          }
        }
        break;
    }
    return listTempFiles;
  }

  getAllFilesInAllStepsWhenUpdate(data: {
    exerciseType: EnumExcerciseType;
    details: MusclePcDto[] | ReelDto[] | VideoDto[] | InformationDto[];
    listFilesFromDb: string[];
  }) {
    const { exerciseType, details, listFilesFromDb } = data;
    const listTempFiles: string[] = [];

    switch (exerciseType) {
      case EnumExcerciseType.VIDEO:
        for (const step of details as VideoDto[]) {
          if (step.typeOfScreen === EnumScreenTypeOfVideo.VIDEO && !listFilesFromDb.includes(step.path)) {
            listTempFiles.push(step.path);
          }
        }
        break;

      case EnumExcerciseType.REEL:
        for (const step of details as ReelDto[]) {
          if (!listFilesFromDb.includes(step.path)) {
            listTempFiles.push(step.path);
          }
        }
        break;

      case EnumExcerciseType.INFORMATION:
        for (const step of details as InformationDto[]) {
          if (step.typeOfScreen === EnumScreenTypeOfInformation.FLEXIBLE) {
            for (const component of step.moreComponents) {
              if (component.type === EnumTypeComponentOfFlexibleScreen.IMAGE && !listFilesFromDb.includes(component.path)) {
                listTempFiles.push(component.path);
              }
            }
          }

          if (step.typeOfScreen === EnumScreenTypeOfInformation.AUDIO) {
            if (!listFilesFromDb.includes(step.audioPath)) {
              listTempFiles.push(step.audioPath);
            }
            if (!listFilesFromDb.includes(step.imagePath)) {
              listTempFiles.push(step.imagePath);
            }
          }
        }
        break;
    }
    return listTempFiles;
  }
}
