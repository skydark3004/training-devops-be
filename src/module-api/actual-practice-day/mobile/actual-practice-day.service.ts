import { Injectable } from '@nestjs/common';
import { convertFullPathToPreview, convertUrlToPreview } from 'src/common';

import { ActualPracticeDayRepository, LevelRepository } from 'src/module-repository/repository';

@Injectable()
export class ActualPracticeDayServiceMobile {
  constructor(
    private readonly actualPracticeDayRepository: ActualPracticeDayRepository,
    private readonly levelRepository: LevelRepository,
  ) {}

  async getCurrentActualPracticeDayVer2(userId: string) {
    const isExistAtLeast = await this.actualPracticeDayRepository.findOneByParams({ conditions: { userId }, select: { userId: true } });

    if (isExistAtLeast) {
      return await this.getCurrentActualPracticeDayIfExistData(userId);
    }

    return await this.getCurrentActualPracticeDayIfNotExistData();
  }

  async getCurrentActualPracticeDay(userId: string) {
    const current = await this.actualPracticeDayRepository.typeOrm
      .createQueryBuilder('actual_practice_day')
      .leftJoin('actual_practice_day.levelOfCustomer', 'level_of_customer')
      .leftJoin('actual_practice_day.exercisesInThatDay', 'actual_practice_day_map_exercise')
      .leftJoin('actual_practice_day_map_exercise.exercise', 'exercise')
      .where('actual_practice_day.isCompleted = FALSE AND actual_practice_day.userId = :userId', { userId })
      .orderBy('actual_practice_day.index', 'ASC')
      .select([
        'actual_practice_day.id',
        'actual_practice_day.levelOfCustomerId',
        'actual_practice_day.isCompleted',
        'actual_practice_day.totalExercises',
        'actual_practice_day.index',
        'level_of_customer.id',
        'level_of_customer.index',
        'level_of_customer.totalDaysToStudy',
        'actual_practice_day_map_exercise.id',
        'actual_practice_day_map_exercise.index',
        'actual_practice_day_map_exercise.frequency',
        'actual_practice_day_map_exercise.currentPracticeTimes',
        'actual_practice_day_map_exercise.isCompleted',
        'exercise.id',
        'exercise.name',
        'exercise.thumbnail',
      ])
      .getOne();

    if (!current) {
      return { data: null, isPracticeAtLeastOne: false };
    }

    current.exercisesInThatDay = current.exercisesInThatDay.map((el) => {
      return { ...el, exercise: convertUrlToPreview(el.exercise, { thumbnail: true }) };
    }) as any;

    return { data: current, isPracticeAtLeastOne: false };
  }

  private async getCurrentActualPracticeDayIfExistData(userId: string) {
    const current = await this.actualPracticeDayRepository.typeOrm
      .createQueryBuilder('actual_practice_day')
      .leftJoin('actual_practice_day.levelOfCustomer', 'level_of_customer')
      .leftJoin('actual_practice_day.exercisesInThatDay', 'actual_practice_day_map_exercise')
      .leftJoin('actual_practice_day_map_exercise.exercise', 'exercise')
      .where('actual_practice_day.isCompleted = FALSE AND actual_practice_day.userId = :userId', { userId })
      .orderBy('actual_practice_day.index', 'ASC')
      .select([
        'actual_practice_day.id',
        'actual_practice_day.levelOfCustomerId',
        'actual_practice_day.isCompleted',
        'actual_practice_day.totalExercises',
        'actual_practice_day.index',
        'level_of_customer.id',
        'level_of_customer.index',
        'level_of_customer.totalDaysToStudy',
        'actual_practice_day_map_exercise.id',
        'actual_practice_day_map_exercise.index',
        'actual_practice_day_map_exercise.frequency',
        'actual_practice_day_map_exercise.currentPracticeTimes',
        'actual_practice_day_map_exercise.isCompleted',
        'exercise.id',
        'exercise.name',
        'exercise.thumbnail',
      ])
      .getOne();

    current.exercisesInThatDay = current.exercisesInThatDay.map((el) => {
      return { ...el, exercise: convertUrlToPreview(el.exercise, { thumbnail: true }) };
    }) as any;

    return { data: current, isPracticeAtLeastOne: true };
  }

  async getCurrentActualPracticeDayIfNotExistData() {
    const levelOne: any = await this.levelRepository.typeOrm
      .createQueryBuilder('level')
      // .leftJoinAndMapOne('level.practiceDays', 'practice_day')
      .leftJoinAndMapOne(
        'level.practiceDay', // tên field sau khi map sẽ trả ra khi return json
        'practice_day', // tên table
        'practice_day', // alias
        'level.id = practice_day.levelId AND practice_day.deletedAt IS NULL AND practice_day.index = 1',
      )
      .leftJoinAndSelect('practice_day.exercisesOfEachDay', 'practice_day_map_exercise')
      .leftJoinAndSelect('practice_day_map_exercise.exercise', 'exercise')
      .orderBy('level.index', 'ASC')
      .addOrderBy('practice_day.index', 'ASC')
      .addOrderBy('practice_day_map_exercise.index', 'ASC')
      .select([
        'level.id',
        'level.name',
        'level.index',
        'level.totalDaysToStudy',
        'practice_day.totalExercises',
        'practice_day.index',
        'practice_day_map_exercise.id',
        'practice_day_map_exercise.index',
        'practice_day_map_exercise.frequency',
        'practice_day_map_exercise.description',
        'exercise.id',
        'exercise.name',
        'exercise.thumbnail',
        'exercise.description',
      ])
      .getOne();

    for (const exercisesOfEachDay of levelOne.practiceDay.exercisesOfEachDay) {
      exercisesOfEachDay.exercise.thumbnailToPreview = exercisesOfEachDay.exercise.thumbnail
        ? convertFullPathToPreview(exercisesOfEachDay.exercise.thumbnail)
        : null;
    }

    return { data: levelOne, isPracticeAtLeastOne: false };
  }
}
