import { convertUrlToPreview } from 'src/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ExperienceReviewRepository,
  LevelSexologyOfCustomerMapExerciseRepository,
  LevelSexologyOfCustomerRepository,
} from 'src/module-repository/repository';
import { CompleteExerciseDto } from './dto';

@Injectable()
export class ActualPracticeSexologyExerciseServiceMobile {
  constructor(
    private readonly levelSexologyOfCustomerMapExerciseRepository: LevelSexologyOfCustomerMapExerciseRepository,
    private readonly experienceReviewRepository: ExperienceReviewRepository,
    private readonly levelSexologyOfCustomerRepository: LevelSexologyOfCustomerRepository,
  ) {}

  async getPreviewById(id: string, userId: string) {
    const actualPraticeExercise = await this.levelSexologyOfCustomerMapExerciseRepository.findOneByParams({
      conditions: { id, userId },
      relations: { exercise: true },
      select: {
        id: true,
        index: true,
        exerciseCloneData: true,
        isCompleted: true,
        exercise: {
          id: true,
          name: true,
          thumbnail: true,
          guideVideos: true,
        },
      },
    });
    if (!actualPraticeExercise) throw new BadRequestException('Không tìm thấy bài tập');

    actualPraticeExercise.exercise = convertUrlToPreview(actualPraticeExercise.exercise, { thumbnail: true, guideVideos: true }) as any;

    return actualPraticeExercise;
  }

  async getDetailById(id: string) {
    const getById: any = await this.levelSexologyOfCustomerMapExerciseRepository.findById(id, {
      relations: { exercise: true },
      select: {
        id: true,
        index: true,
        levelOfCustomerId: true,
        isCompleted: true,
        exercise: {
          id: true,
          name: true,
          thumbnail: true,
          guideVideos: true,
        },
      },
    });
    if (!getById) throw new BadRequestException('Không tìm thấy bài tập');

    getById.exercise = convertUrlToPreview(getById.exercise, { thumbnail: true, guideVideos: true }) as any;

    return getById;
  }

  async completeById(id: string, body: CompleteExerciseDto, userId: string) {
    const actualPraticeExercise = await this.levelSexologyOfCustomerMapExerciseRepository.findOneByParams({
      conditions: { id, userId },
    });
    if (!actualPraticeExercise) throw new BadRequestException('Không tìm thấy bài tập');

    if (actualPraticeExercise.isCompleted) {
      return await this.getDetailById(id);
    }

    await Promise.all([
      this.levelSexologyOfCustomerMapExerciseRepository.typeOrm.update({ id }, { isCompleted: true }),
      this.experienceReviewRepository.typeOrm.save(
        { userId: userId, star: body.star, content: body.content, exerciseId: actualPraticeExercise.exerciseCloneData.id },
        { transaction: false },
      ),
      this.updateActualPracticeDayCompleted(actualPraticeExercise.levelOfCustomerId),
    ]);

    const result = await this.getDetailById(id);

    return result;
  }

  private async updateActualPracticeDayCompleted(levelOfCustomerId: string) {
    const getById = await this.levelSexologyOfCustomerRepository.findById(levelOfCustomerId, {
      relations: { actualExercises: true },
    });

    const totalCompleted = getById.actualExercises.filter((el) => el.isCompleted).length;

    const paramsToUpdate = {
      totalDoneExercises: totalCompleted,
      isCompleted: totalCompleted === getById.actualExercises?.length,
    };

    await this.levelSexologyOfCustomerRepository.typeOrm.update({ id: levelOfCustomerId }, paramsToUpdate);
  }
}
