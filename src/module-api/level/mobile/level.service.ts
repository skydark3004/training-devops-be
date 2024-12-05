import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, LessThan } from 'typeorm';
import {
  ActualPracticeDayMapExerciseRepository,
  ExerciseRepository,
  LevelOfCustomerRepository,
  LevelRepository,
  PurchaseRepository,
  PracticeDayMapExerciseRepository,
  PracticeDayRepository,
} from 'src/module-repository/repository';
import { ActualPracticeDayEntity, ActualPracticeDayMapExerciseEntity, LevelOfCustomerEntity } from 'src/core/entity';
import { arrayToObject } from 'src/libs/utils';
import { convertFullPathToPreview } from 'src/common';
import { IGetListExerciseDoneGroupByExericseId, IGetListExerciseGroupByExericseId } from './level.interface';
import { PreviewLevelDto } from './dto';
import { EnumPreviewLeveType } from './level.enum';

@Injectable()
export class LevelServiceMobile {
  constructor(
    private readonly levelRepository: LevelRepository,
    //private readonly levelMapUserEntity: LevelOfCustomerEntity,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly levelOfCustomerRepository: LevelOfCustomerRepository,
    private readonly actualPracticeDayMapExerciseRepository: ActualPracticeDayMapExerciseRepository,
    private readonly practiceDayMapExerciseRepository: PracticeDayMapExerciseRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly practiceDayRepository: PracticeDayRepository,
  ) {}

  async getList(userId: string) {
    const currentPackage = await this.purchaseRepository.findOneByParams({
      conditions: { userId, isUseNow: true },
      relations: { package: true },
    });

    //TODO: check nếu level  khách hàng đang học mà bị status = false thì vẫn hiển thị
    // nếu chưa học mà status = false thì không hiển thị
    const listLevels = await this.levelRepository.typeOrm
      .createQueryBuilder('level')
      //.where('level.status = TRUE')
      .leftJoinAndMapOne(
        'level.levelOfCustomer', // tên field sau khi map sẽ trả ra khi return json
        'level_of_customer', // tên table
        'level_of_customer', // alias
        'level_of_customer.userId = :userId AND level_of_customer.levelPcId = level.id',
        { userId: userId },
      )
      .leftJoinAndSelect('level_of_customer.actualPracticeDays', 'actual_practice_day')
      .orderBy('level.index', 'ASC')
      .getMany();

    for (const level of listLevels as any[]) {
      const isMustUpgradePackage = currentPackage && level.isFree === false && level.levelOfCustomer === null;
      const isDone = level?.levelOfCustomer?.isCompleted === true;
      const isNotStart = level?.levelOfCustomer === null;
      const isStudying = level?.levelOfCustomer?.isCompleted === false;

      level.pathThumbnailToPreview = convertFullPathToPreview(level.pathThumbnail);
      level.isMustUpgradePackage = isMustUpgradePackage;
      level.isDone = isDone;
      level.isNotStart = isNotStart;
      level.isStudying = isStudying;
    }

    const results = this.levelRepository.convertThumbnail(listLevels);

    return results;
  }

  /**
   *  1. từ level lấy ra tất cả các bài tập tương ứng
   *  2. lấy ra level of customer để lấy ra các bài tập
   *  3. map lại vs nhau
   */

  async getProgressExercisesByLevelId(levelId: string, userId: string) {
    const listExercises: IGetListExerciseGroupByExericseId[] = await this.practiceDayMapExerciseRepository.typeOrm
      .createQueryBuilder('practiceDayMapExercise')
      .leftJoin('practiceDayMapExercise.practiceDay', 'practice_day')
      .leftJoin('practiceDayMapExercise.exercise', 'exercise')
      .where('practice_day.levelId = :levelId', { levelId })
      .groupBy('exercise.id')
      .select([
        'exercise.id as "exerciseId"',
        'COUNT(*) AS "total"',
        `COALESCE (NULLIF (JSONB_AGG ( JSONB_BUILD_OBJECT ( 'id', exercise.id, 'name', exercise.name, 'thumbnail', exercise.thumbnail ) ) -> 0,'{}' :: JSONB ),NULL ) AS exercise`,
      ])
      .getRawMany();

    const listExercisesDone: IGetListExerciseDoneGroupByExericseId[] = await this.actualPracticeDayMapExerciseRepository.typeOrm
      .createQueryBuilder('actualPracticeDayMapExercise')
      .leftJoin('actualPracticeDayMapExercise.actualPracticeDay', 'actual_practice_day')
      .leftJoin('actual_practice_day.levelOfCustomer', 'level_of_customer')
      .leftJoin('actualPracticeDayMapExercise.exercise', 'exercise')
      .where('level_of_customer.levelPcId = :levelId AND level_of_customer.userId = :userId', { levelId, userId })
      .andWhere('actual_practice_day.isCompleted = true')
      .andWhere('actualPracticeDayMapExercise.isCompleted = true')
      .groupBy('actualPracticeDayMapExercise.exerciseId')
      .select(['actualPracticeDayMapExercise.exerciseId as "exerciseId"', 'COUNT(*) as totalDone'])
      .getRawMany();

    const format = arrayToObject(listExercisesDone, 'exerciseId');

    const result = listExercises.map((exe) => {
      const isExist = format[exe.exerciseId];

      return {
        ...exe,
        totalDone: isExist ? isExist.totalDone : 0,
        total: Number(exe.total),
        exercise: { ...exe.exercise, thumbnailToPreview: convertFullPathToPreview(exe.exercise.thumbnail) },
      };
    });

    return result;

    /*     const [listActualExercises, listDoneExercises] = await Promise.all([
      this.actualPracticeDayMapExerciseRepository.typeOrm
        .createQueryBuilder('actualPracticeDayMapExercise')
        .leftJoin('actualPracticeDayMapExercise.actualPracticeDay', 'actual_practice_day')
        .leftJoin('actual_practice_day.levelOfCustomer', 'level_of_customer')
        .where('level_of_customer.levelPcId = :levelId', { levelId })
        .andWhere('actual_practice_day.userId = :userId', { userId })
        .groupBy('actualPracticeDayMapExercise.exerciseId')
        .select(['actualPracticeDayMapExercise.exerciseId as "exerciseId"', 'COUNT(*) as total'])
        .getRawMany(),
      this.actualPracticeDayMapExerciseRepository.typeOrm
        .createQueryBuilder('actualPracticeDayMapExercise')
        .leftJoin('actualPracticeDayMapExercise.actualPracticeDay', 'actual_practice_day')
        .leftJoin('actual_practice_day.levelOfCustomer', 'level_of_customer')
        .where('level_of_customer.levelPcId = :levelId', { levelId })
        .andWhere('actualPracticeDayMapExercise.isCompleted = true')
        .andWhere('actual_practice_day.userId = :userId', { userId })
        .groupBy('actualPracticeDayMapExercise.exerciseId')
        .select(['actualPracticeDayMapExercise.exerciseId as "exerciseId"', 'COUNT(*) as total'])
        .getRawMany(),
    ]);

    const formatListActualExercises = arrayToObject(listActualExercises, 'exerciseId');
    const formatListDoneExercises = arrayToObject(listDoneExercises, 'exerciseId');

    const listExerciseIds = listActualExercises.map((el) => el.exerciseId);
    const listExercises: any = await this.exerciseRepository.findAllByParams({
      conditions: { id: In(listExerciseIds) },
      select: { ...this.exerciseRepository.getSelectColumns({ columns: ['id', 'name', 'thumbnail'], type: 'SELECT' }) },
    });

    for (const ex of listExercises) {
      ex.total = Number(formatListActualExercises[ex.id]?.total);
      ex.totalDone = Number(formatListDoneExercises[ex.id]?.total || 0);
      ex.thumbnailToPreview = convertFullPathToPreview(ex.thumbnail);
    }

    return listExercises; */
  }

  async getPreview(levelId: string, body: PreviewLevelDto) {
    const level = await this.levelRepository.findById(levelId, {
      select: this.levelRepository.getSelectColumns({ columns: ['id', 'name', 'totalDaysToStudy', 'index'], type: 'SELECT' }),
    });
    if (!level) {
      throw new BadRequestException('Không tìm thấy level');
    }

    switch (body.type) {
      case EnumPreviewLeveType.PERSONAL_PLAN:
        const practiceDay = await this.practiceDayRepository.typeOrm
          .createQueryBuilder('practiceDay')
          .where('practiceDay.levelId = :levelId', { levelId })
          .andWhere('practiceDay.index = 1')
          .leftJoin('practiceDay.level', 'level')
          .leftJoin('practiceDay.exercisesOfEachDay', 'practice_day_map_exercise')
          .leftJoin('practice_day_map_exercise.exercise', 'exercise')
          .select([
            'practiceDay.id',
            /*             'level.id',
            'level.name',
            'level.totalDaysToStudy',
            'level.index', */
            'practice_day_map_exercise.frequency',
            'exercise.id',
            'exercise.name',
            'exercise.thumbnail',
          ])
          .getOne();

        for (const exercisesOfEachDay of practiceDay.exercisesOfEachDay) {
          exercisesOfEachDay.exercise.thumbnailToPreview = convertFullPathToPreview(exercisesOfEachDay.exercise.thumbnail);
        }

        return { level, practiceDay };

      case EnumPreviewLeveType.LIST_EXERCISES:
        const { practiceDayIds } = await this.practiceDayRepository.typeOrm
          .createQueryBuilder('practiceDay')
          .where('practiceDay.levelId = :levelId', { levelId })
          .groupBy('practiceDay.levelId')
          .select(['practiceDay.levelId as "levelId"', 'array_agg(practiceDay.id) as "practiceDayIds"']) // push id to array
          .getRawOne();

        const listExercises = await this.practiceDayMapExerciseRepository.typeOrm
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

        const result = listExercises.map((el) => {
          return {
            ...el,
            total: Number(el.total),
            exercise: { ...el.exercise, thumbnailToPreview: convertFullPathToPreview(el?.exercise?.thumbnail) },
          };
        });

        return { level, listExercises: result };
    }
  }

  async startLearning(levelId: string, userId: string) {
    const getById = await this.levelRepository.findById(levelId, {
      relations: { practiceDays: { exercisesOfEachDay: { exercise: true } } },
      order: { practiceDays: { index: 'ASC' } },
    });
    if (!getById) throw new BadRequestException('Không tìm thấy level');

    if (getById.index > 1) {
      // check đã học các level trước đó chưa
      const totalLearnedLevels = await this.levelOfCustomerRepository.typeOrm.count({
        where: { index: LessThan(getById.index), userId: userId },
      });
      if (totalLearnedLevels < getById.index - 1) {
        throw new BadRequestException('Bạn cần học các level trước đó thì mới có thể bắt đầu học level này');
      }

      // check tất cả các level trước đó đã hoàn thành chưa
      const previousLevel = await this.levelOfCustomerRepository.findOneByParams({
        conditions: { index: LessThan(getById.index), userId: userId, isCompleted: false },
      });
      if (previousLevel) throw new BadRequestException('Bạn cần hoàn thành level trước thì mới có thể học level này');
    }

    const isExist = await this.levelOfCustomerRepository.typeOrm.exists({ where: { index: getById.index, userId: userId } });
    if (isExist) throw new BadRequestException('Bạn đã học level này. Không thể bắt đầu lại');

    const callback = async (manager: EntityManager) => {
      const rawLevelOfCustomerRepository = manager.getRepository(LevelOfCustomerEntity);
      const rawActualPracticeDayRepository = manager.getRepository(ActualPracticeDayEntity);
      const rawActualPracticeDayMapExerciseRepository = manager.getRepository(ActualPracticeDayMapExerciseEntity);
      const levelOfCustomer = await rawLevelOfCustomerRepository.save({
        userId,
        levelPcId: getById.id,
        totalDaysToStudy: getById.totalDaysToStudy,
        index: getById.index,
      });

      for (const practiceDay of getById.practiceDays) {
        const actualPracticeDay = await rawActualPracticeDayRepository.save({
          levelOfCustomerId: levelOfCustomer.id,
          totalExercises: practiceDay.totalExercises,
          index: practiceDay.index,
          practiceDayId: practiceDay.id,
          userId,
        });

        const listPromisesToSaveActualPracticeDayMapExercise = practiceDay.exercisesOfEachDay.map((exerciseOfEachDayFromDB) => {
          return rawActualPracticeDayMapExerciseRepository.save({
            index: exerciseOfEachDayFromDB.index,
            frequency: exerciseOfEachDayFromDB.frequency,
            description: exerciseOfEachDayFromDB.description,
            actualPracticeDayId: actualPracticeDay.id,
            exerciseId: exerciseOfEachDayFromDB.exerciseId,
            exerciseCloneData: exerciseOfEachDayFromDB.exercise,
            userId,
          });
        });

        await Promise.all(listPromisesToSaveActualPracticeDayMapExercise);
      }

      return levelOfCustomer;
    };

    const result = await this.levelRepository.useTransaction(callback);

    return result;
  }
}
