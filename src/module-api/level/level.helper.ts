import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelDto, UpdateLevelDto } from './admin/dto';
import { arrayUnique } from 'src/libs/utils';
import { LevelEntity } from 'src/core/entity';
import { ExerciseRepository } from 'src/module-repository/repository';

@Injectable()
export class LevelHelper {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  getUniqueExerciseIds(body: CreateLevelDto): string[] {
    const exerciseIds: string[] = [];
    for (const day of body.days) {
      for (const exercise of day.details) {
        exerciseIds.push(exercise.exerciseId);
      }
    }

    return arrayUnique(exerciseIds);
  }

  async getParamUpdateLevel(level: LevelEntity, body: UpdateLevelDto) {
    let listIdsOfPracticeDaysToDelete = level.practiceDays.map((el) => el.id);
    const listParamToInsertPracticeDays: any[] = [];
    const listParamToInsertPracticeDayMapExercise: any[] = [];
    const listParamToUpdatePracticeDayMapExercise: any[] = [];
    const listIdsOfPracticeDaysMapExerciseToDelete: string[] = [];
    const listParamToUpdatePracticeDay: any[] = [];

    for (const [index, dayInBody] of body.days.entries()) {
      if (dayInBody.id) {
        listIdsOfPracticeDaysToDelete = listIdsOfPracticeDaysToDelete.filter((el) => el !== dayInBody.id);

        const practiceDayFromDB = level.practiceDays.find((el) => el.id === dayInBody.id);
        if (!practiceDayFromDB) throw new NotFoundException();

        // update practice day
        listParamToUpdatePracticeDay.push({ id: dayInBody.id, totalExercises: dayInBody.details.length, index: index + 1 });

        let idsExerciseOfEachDayToDelete = practiceDayFromDB.exercisesOfEachDay.map((el) => el.id);

        for (const exercisesOfEachDayInBody of dayInBody.details) {
          if (exercisesOfEachDayInBody.id) {
            const eachExerciseInThatDayFromDB = practiceDayFromDB.exercisesOfEachDay.find((el) => el.id === exercisesOfEachDayInBody.id);
            if (!eachExerciseInThatDayFromDB) throw new NotFoundException();

            idsExerciseOfEachDayToDelete = idsExerciseOfEachDayToDelete.filter((el) => el !== eachExerciseInThatDayFromDB.id);

            // nếu thay đổi thì validate
            if (exercisesOfEachDayInBody.exerciseId !== eachExerciseInThatDayFromDB.exerciseId) {
              await this.exerciseRepository.typeOrm.findOneOrFail({ where: { id: exercisesOfEachDayInBody.exerciseId } });
            }

            //update
            const paramToUpdatePracticeDayMapExercise = Object.assign(eachExerciseInThatDayFromDB, exercisesOfEachDayInBody);
            listParamToUpdatePracticeDayMapExercise.push(paramToUpdatePracticeDayMapExercise);
          }

          //insert
          if (!exercisesOfEachDayInBody.id) {
            listParamToInsertPracticeDayMapExercise.push({ ...exercisesOfEachDayInBody, practiceDayId: dayInBody.id });
          }
        }

        // danh sách bài tập của ngày hôm đó cần xóa
        listIdsOfPracticeDaysMapExerciseToDelete.push(...idsExerciseOfEachDayToDelete);
      }

      if (!dayInBody.id) {
        const paramToInsertPracticeDay = {
          totalExercises: dayInBody.totalExercises,
          index: index + 1,
          levelId: level.id,
          exercisesOfEachDay: dayInBody.details,
        };

        listParamToInsertPracticeDays.push(paramToInsertPracticeDay);
      }
    }

    return {
      listIdsOfPracticeDaysToDelete,
      listParamToInsertPracticeDays,
      listParamToInsertPracticeDayMapExercise,
      listParamToUpdatePracticeDayMapExercise,
      listIdsOfPracticeDaysMapExerciseToDelete,
      listParamToUpdatePracticeDay,
    };
  }
}
