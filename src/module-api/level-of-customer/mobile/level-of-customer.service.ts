import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import {
  ActualPracticeDayMapExerciseRepository,
  ActualPracticeDayRepository,
  ExerciseRepository,
  LevelOfCustomerRepository,
  LevelRepository,
  PracticeDayMapExerciseRepository,
  PracticeDayRepository,
} from 'src/module-repository/repository';
import {
  IGetActualPracticeDayIds,
  IGetListActualExerciseOfActualPracticeDayMapExercise,
  IGetListExerciseOfPracticeDayMapExercise,
  IGetNumberOfCompleteDoneExerciseGroupByExerciseId,
} from './level-of-customer.interface';
import { convertFullPathToPreview } from 'src/common';
import { GroupByExericseWhenStudyingDto } from './dto';
import { EnumGroupByExericseWhenStudyingType } from './level-of-customer.enum';
import { LevelOfCustomerEntity } from 'src/core/entity';
import { arrayToObject } from 'src/libs/utils';

@Injectable()
export class LevelOfCustomerServiceMobile {
  constructor(
    private readonly levelRepository: LevelRepository,
    //private readonly levelMapUserEntity: LevelOfCustomerOfCustomerEntity,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly levelOfCustomerRepository: LevelOfCustomerRepository,
    private readonly actualPracticeDayRepository: ActualPracticeDayRepository,
    private readonly actualPracticeDayMapExerciseRepository: ActualPracticeDayMapExerciseRepository,
    private readonly practiceDayRepository: PracticeDayRepository,
    private readonly practiceDayMapExerciseRepository: PracticeDayMapExerciseRepository,
  ) {}

  async groupByExericseWhenDone(levelOfCustomerId: string, userId: string) {
    const levelOfCustomer = await this.levelOfCustomerRepository.findOneByParams({ conditions: { userId, id: levelOfCustomerId } });
    if (!levelOfCustomer) {
      throw new BadRequestException('Không tìm thấy level tập luyện của khách hàng');
    }

    if (!levelOfCustomer.isCompleted) {
      throw new BadRequestException('Bạn chưa hoàn thành level này');
    }

    const { actualPracticeDayIds }: IGetActualPracticeDayIds = await this.actualPracticeDayRepository.typeOrm
      .createQueryBuilder('actualPracticeDay')
      .where('actualPracticeDay.levelOfCustomerId = :levelOfCustomerId AND actualPracticeDay.userId = :userId', { levelOfCustomerId, userId })
      .groupBy('actualPracticeDay.levelOfCustomerId')
      .select(['actualPracticeDay.levelOfCustomerId as "levelOfCustomerId"', 'array_agg(actualPracticeDay.id) as "actualPracticeDayIds"']) // push id to array
      .getRawOne();

    const listExercises: IGetNumberOfCompleteDoneExerciseGroupByExerciseId[] = await this.actualPracticeDayMapExerciseRepository.typeOrm
      .createQueryBuilder('actualPracticeDayMapExercise')
      .where(
        `actualPracticeDayMapExercise.actualPracticeDayId IN ${this.actualPracticeDayMapExerciseRepository.buildArrayToStringInRawQuery(actualPracticeDayIds)}`,
      )
      .leftJoin('actualPracticeDayMapExercise.exercise', 'exercise')
      .groupBy('actualPracticeDayMapExercise.exerciseId')
      .select([
        'actualPracticeDayMapExercise.exerciseId as "exerciseId"',
        'COUNT(*) FILTER (WHERE actualPracticeDayMapExercise.isCompleted = true) AS "totalCompleted"',
        'COUNT(*) AS "total"',
        `COALESCE (NULLIF (JSONB_AGG ( JSONB_BUILD_OBJECT ( 'id', exercise.id, 'name', exercise.name, 'thumbnail', exercise.thumbnail ) ) -> 0,'{}' :: JSONB ),NULL ) AS exercise`,
      ])
      .getRawMany();

    const result = listExercises.map((el) => {
      return {
        ...el,
        totalCompleted: Number(el.totalCompleted),
        total: Number(el.total),
        exercise: { ...el.exercise, thumbnailToPreview: convertFullPathToPreview(el?.exercise?.thumbnail) },
      };
    });

    return result;
  }

  async getCurrentPracticeDayByLevelOfCustomerId(levelOfCustomerId: string, userId: string, body: GroupByExericseWhenStudyingDto) {
    const levelOfCustomer = await this.levelOfCustomerRepository.typeOrm
      .createQueryBuilder('levelOfCustomer')
      .where('levelOfCustomer.userId = :userId', { userId })
      .andWhere('levelOfCustomer.id = :levelOfCustomerId', { levelOfCustomerId })
      .leftJoinAndSelect('levelOfCustomer.actualPracticeDays', 'actualPracticeDay', 'actualPracticeDay.isCompleted = false')
      .orderBy('actualPracticeDay.index', 'ASC')
      .getOne();

    if (!levelOfCustomer) {
      throw new BadRequestException('Không tìm thấy level tập luyện của khách hàng');
    }

    if (levelOfCustomer.isCompleted) {
      throw new BadRequestException('Bạn đã hoàn thành level này');
    }

    const currentPracticeDayId = levelOfCustomer.actualPracticeDays.at(0).id;

    switch (body.type) {
      case EnumGroupByExericseWhenStudyingType.PERSONAL_PLAN:
        return await this.groupByExericseWhenStudyingWithPersonalPlanType(levelOfCustomer, currentPracticeDayId);

      case EnumGroupByExericseWhenStudyingType.LIST_EXERCISES:
        return await this.groupByExericseWhenStudyingWithListExericseType(levelOfCustomer, currentPracticeDayId);
    }
  }

  private async groupByExericseWhenStudyingWithPersonalPlanType(levelOfCustomer: LevelOfCustomerEntity, currentPracticeDayId: string) {
    const listActualExercises = await this.actualPracticeDayMapExerciseRepository.typeOrm
      .createQueryBuilder('actualExe')
      .where('actualExe.actualPracticeDayId = :actualPracticeDayId', { actualPracticeDayId: currentPracticeDayId })
      .leftJoin('actualExe.exercise', 'exercise')
      .select([
        'actualExe.id',
        'actualExe.frequency',
        'actualExe.currentPracticeTimes',
        'actualExe.isCompleted',
        'exercise.id',
        'exercise.name',
        'exercise.thumbnail',
      ])
      .getMany();

    for (const exe of listActualExercises) {
      exe.exercise.thumbnailToPreview = convertFullPathToPreview(exe.exercise.thumbnail);
    }

    const result = {
      levelOfCustomer: _.pick(levelOfCustomer, ['id', 'status', 'type', 'isCompleted', 'totalDaysToStudy', 'index']),
      listActualExercises,
    };

    return result;
  }

  private async groupByExericseWhenStudyingWithListExericseType(levelOfCustomer: LevelOfCustomerEntity, currentPracticeDayId: string) {
    const { practiceDayIds } = await this.practiceDayRepository.typeOrm
      .createQueryBuilder('practiceDay')
      .where('practiceDay.levelId = :levelId', { levelId: levelOfCustomer.levelPcId })
      .groupBy('practiceDay.levelId')
      .select(['practiceDay.levelId as "levelId"', 'array_agg(practiceDay.id) as "practiceDayIds"']) // push id to array
      .getRawOne();

    const listExercises: IGetListExerciseOfPracticeDayMapExercise[] = await this.practiceDayMapExerciseRepository.typeOrm
      .createQueryBuilder('practiceDayMapExercise')
      .where(`practiceDayMapExercise.practiceDayId IN ${this.practiceDayMapExerciseRepository.buildArrayToStringInRawQuery(practiceDayIds)}`)
      .leftJoin('practiceDayMapExercise.exercise', 'exercise')
      .groupBy('practiceDayMapExercise.exerciseId')
      .select([
        'practiceDayMapExercise.exerciseId as "exerciseId"',
        'COUNT(*) AS total',
        `COALESCE (NULLIF (JSONB_AGG ( JSONB_BUILD_OBJECT ( 'id', exercise.id, 'name', exercise.name, 'thumbnail', exercise.thumbnail ) ) -> 0,'{}' :: JSONB ),NULL ) AS exercise`,
      ])
      .getRawMany();

    const listActualDoneExercises: IGetListActualExerciseOfActualPracticeDayMapExercise[] = await this.actualPracticeDayMapExerciseRepository.typeOrm
      .createQueryBuilder('actualPracticeDayMapExercise')
      .where(`actualPracticeDayMapExercise.actualPracticeDayId = :actualPracticeDayId`, { actualPracticeDayId: currentPracticeDayId })
      .leftJoin('actualPracticeDayMapExercise.exercise', 'exercise')
      .andWhere('actualPracticeDayMapExercise.isCompleted = true')
      .groupBy('actualPracticeDayMapExercise.exerciseId')
      .select(['actualPracticeDayMapExercise.exerciseId as "exerciseId"', 'COUNT(*) AS "totalCompleted"'])
      .getRawMany();

    const convertListActualDoneExercises = arrayToObject(listActualDoneExercises, 'exerciseId');

    const result = listExercises.map((exe) => {
      const isExist = convertListActualDoneExercises[exe.exerciseId];

      return {
        total: Number(exe.total),
        ...exe.exercise,
        thumbnailToPreview: convertFullPathToPreview(exe.exercise.thumbnail),
        current: isExist ? Number(isExist.totalCompleted) : 0,
      };
    });

    return result;
  }
}
