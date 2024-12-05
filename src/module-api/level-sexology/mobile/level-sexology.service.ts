import { BadRequestException, Injectable } from '@nestjs/common';
import { LevelSexologyHelper } from '../level-sexology.helper';
import { EntityManager, LessThan } from 'typeorm';
import {
  ExerciseRepository,
  LevelSexologyOfCustomerRepository,
  LevelSexologyRepository,
  ModuleRepository,
  PurchaseRepository,
} from 'src/module-repository/repository';
import { LevelSexologyOfCustomerEntity, LevelSexologyOfCustomerMapExerciseEntity } from 'src/core/entity';
import { convertFullPathToPreview } from 'src/common';

@Injectable()
export class LevelSexologyServiceMobile {
  constructor(
    private readonly levelSexologyHelper: LevelSexologyHelper,
    private readonly levelSexologyRepository: LevelSexologyRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly levelSexologyOfCustomerRepository: LevelSexologyOfCustomerRepository,
  ) {}

  async getListGroupByModule(userId: string) {
    const currentPackage = await this.purchaseRepository.findOneByParams({
      conditions: { userId, isUseNow: true },
    });

    const listModules = await this.moduleRepository.typeOrm
      .createQueryBuilder('module')
      .innerJoinAndSelect('module.levelSexologies', 'levelSexologies', 'levelSexologies.status = TRUE')
      .leftJoinAndMapOne(
        'levelSexologies.levelOfCustomer', // tên field sau khi map sẽ trả ra khi return json
        'level_sexology_of_customer', // tên table
        'level_sexology_of_customer', // alias
        'level_sexology_of_customer.userId = :userId AND level_sexology_of_customer.levelSexologyId = levelSexologies.id',
        { userId: userId },
      )
      .orderBy('module.index', 'ASC')
      .addOrderBy('levelSexologies.index', 'ASC')
      .select([
        'module.id',
        'module.name',
        'module.index',
        'levelSexologies.id',
        'levelSexologies.name',
        'levelSexologies.isFree',
        'levelSexologies.index',
        'levelSexologies.pathThumbnail',
        'levelSexologies.pathThumbnailToPreview',
        'level_sexology_of_customer.id',
        'level_sexology_of_customer.totalExercises',
        'level_sexology_of_customer.totalDoneExercises',
        'level_sexology_of_customer.isCompleted',
      ])
      .getMany();

    const result = listModules.map((module: any) => {
      const levelSexologies = module.levelSexologies.map((level: any) => {
        const isMustUpgradePackage = currentPackage && level.isFree === false && level.levelOfCustomer === null;
        const isDone = level?.levelOfCustomer?.isCompleted === true;
        const isNotStart = level?.levelOfCustomer === null;
        const isStudying = level?.levelOfCustomer?.isCompleted === false;
        return {
          ...level,
          isMustUpgradePackage: isMustUpgradePackage,
          isDone: isDone,
          isNotStart: isNotStart,
          isStudying: isStudying,
        };
      });

      return { ...module, levelSexologies };
    });

    return result;
  }

  async startLearning(levelId: string, userId: string) {
    const getById = await this.levelSexologyRepository.findById(levelId, {
      relations: { listExercises: { exercise: true }, module: true },
      order: { listExercises: { index: 'ASC' } },
    });
    if (!getById) throw new BadRequestException('Không tìm thấy level');

    if (!getById.isFree) {
      const currentPackage = await this.purchaseRepository.findOneByParams({ conditions: { userId, isUseNow: true } });
      if (!currentPackage) {
        throw new BadRequestException('Bạn phải nâng cấp gói VIP để bắt đầu học leve này');
      }
    }

    const [totalLevelsNeedToLearn, totalLearnedLevels, isExistNotDone, isExist] = await Promise.all([
      //totalLevelsNeedToLearn
      this.levelSexologyRepository.typeOrm.count({
        where: [{ module: { index: LessThan(getById.module.index) } }, { moduleId: getById.moduleId, index: LessThan(getById.index) }],
        relations: { module: true },
      }),

      //totalLearnedLevels
      this.levelSexologyOfCustomerRepository.typeOrm.count({ where: { userId: userId } }),

      //isExistNotDone -  check tất cả các level trước đó đã hoàn thành chưa
      this.levelSexologyOfCustomerRepository.findOneByParams({
        conditions: { index: LessThan(getById.index), userId: userId, isCompleted: false },
      }),

      //isExist - check xem đã tạo level này chưa?
      this.levelSexologyOfCustomerRepository.typeOrm.exists({ where: { levelSexologyId: getById.id, userId: userId } }),
    ]);

    if (totalLearnedLevels < totalLevelsNeedToLearn) {
      throw new BadRequestException('Bạn cần học các level trước đó thì mới có thể bắt đầu học level này');
    }
    if (isExistNotDone) throw new BadRequestException('Bạn cần hoàn thành level trước thì mới có thể học level này');
    if (isExist) throw new BadRequestException('Bạn đã học level này. Không thể bắt đầu lại');

    const callback = async (manager: EntityManager) => {
      const rawLevelSexologyOfCustomerRepository = manager.getRepository(LevelSexologyOfCustomerEntity);
      const rawLevelSexologyOfCustomerMapExerciseRepository = manager.getRepository(LevelSexologyOfCustomerMapExerciseEntity);

      const levelOfCustomer = await rawLevelSexologyOfCustomerRepository.save({
        userId,
        levelSexologyId: getById.id,
        totalExercises: getById.listExercises.length,
        index: getById.index,
        moduleId: getById.moduleId,
        totalDaysMustLearn: getById.totalDaysMustLearn,
        totalTimesToPractice: getById.totalTimesToPractice,
        typeOfPractice: getById.typeOfPractice,
      });

      const listPromisesToSaveActualPracticeDayMapExercise = getById.listExercises.map((exerciseFromDB) => {
        return rawLevelSexologyOfCustomerMapExerciseRepository.save({
          index: exerciseFromDB.index,
          levelOfCustomerId: levelOfCustomer.id,
          exerciseId: exerciseFromDB.exercise.id,
          exerciseCloneData: exerciseFromDB.exercise,
          userId,
        });
      });

      await Promise.all(listPromisesToSaveActualPracticeDayMapExercise);

      return levelOfCustomer;
    };

    const result = await this.levelSexologyRepository.useTransaction(callback);

    return result;
  }

  async getPreviewById(levelId: string) {
    const getById = await this.levelSexologyRepository.typeOrm
      .createQueryBuilder('level_sexology')
      .leftJoin('level_sexology.listExercises', 'level_sexology_map_exercise')
      .leftJoin('level_sexology_map_exercise.exercise', 'exercise')
      .leftJoin('level_sexology.module', 'module')
      .where('level_sexology.id = :levelId', { levelId })
      .orderBy('level_sexology_map_exercise.index')
      .select([
        'level_sexology.id',
        'level_sexology.index',
        'level_sexology.totalDaysMustLearn',
        'level_sexology.totalTimesToPractice',
        'level_sexology.typeOfPractice',
        'level_sexology.pathThumbnail',
        'level_sexology.pathThumbnailToPreview',
        'module.id',
        'module.name',
        'level_sexology_map_exercise.index',
        'exercise.name',
        'exercise.thumbnail',
      ])
      .getOne();

    if (!getById) throw new BadRequestException('Không tìm thấy level');

    getById.listExercises = getById.listExercises.map((exe) => {
      return { ...exe, exercise: { ...exe.exercise, thumbnailToPreview: convertFullPathToPreview(exe.exercise.thumbnail) } };
    });

    return getById;
  }
}
