import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { EnumResponseError } from './excercise.enum';
import { ExerciseRepository } from 'src/module-repository/repository';

@Injectable()
export class ExerciseServiceMobile {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async getById(id: string) {
    const getById = await this.exerciseRepository.findById(id, { relations: { module: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return this.exerciseRepository.convertUrlToPreview(getById, {
      thumbnail: true,
      guideVideos: true,
      details: true,
    });
  }
}
