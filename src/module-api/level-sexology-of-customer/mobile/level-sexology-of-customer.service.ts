import { BadRequestException, Injectable } from '@nestjs/common';
import { LevelSexologyOfCustomerRepository, LevelSexologyRepository, PurchaseRepository } from 'src/module-repository/repository';
import { convertFullPathToPreview } from 'src/common';

@Injectable()
export class LevelSexologyOfCustomerServiceMobile {
  constructor(
    private readonly levelSexologyOfCustomerRepository: LevelSexologyOfCustomerRepository,
    private readonly levelSexologyRepository: LevelSexologyRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  /*   async getStatisticWhenDone(levelOfCustomerId: string, userId: string) {
    const levelOfCustomer = await this.levelSexologyOfCustomerRepository.findOneByParams({ conditions: { userId, id: levelOfCustomerId } });
    if (!levelOfCustomer) {
      throw new BadRequestException('Không tìm thấy level tập luyện của khách hàng');
    }

    if (!levelOfCustomer.isCompleted) {
      throw new BadRequestException('Bạn chưa hoàn thành level này');
    }

    const level = await this.levelSexologyOfCustomerRepository.findOneByParams({
      conditions: {
        id: levelOfCustomerId,
        userId,
      },
      relations: { actualExercises: true },
    });

    return level;
  } */

  async getStatisticWhenStudying(levelOfCustomerId: string, userId: string) {
    const level = await this.levelSexologyOfCustomerRepository.findOneByParams({
      conditions: {
        id: levelOfCustomerId,
        userId,
      },
      relations: { actualExercises: { exercise: true }, module: true },
      select: {
        id: true,
        module: { id: true, name: true },
        totalExercises: true,
        totalDoneExercises: true,
        index: true,
        actualExercises: {
          id: true,
          isCompleted: true,
          exercise: {
            id: true,
            name: true,
            thumbnail: true,
          },
        },
      },
    });

    if (!level) throw new BadRequestException('Không tìm thấy level tâm lý tình dục của khách hàng');

    const listDoneExercises = level.actualExercises
      .filter((el) => el.isCompleted)
      .map((el) => {
        return { ...el, exercise: { ...el.exercise, thumbnailToPreview: convertFullPathToPreview(el.exercise.thumbnail) } };
      });
    const listNotDoneExercises = level.actualExercises
      .filter((el) => !el.isCompleted)
      .map((el) => {
        return { ...el, exercise: { ...el.exercise, thumbnailToPreview: convertFullPathToPreview(el.exercise.thumbnail) } };
      });

    const result = {
      ...level,
      listDoneExercises,
      listNotDoneExercises,
      actualExercises: undefined,
    };
    return result;
  }

  async getCurrent(userId: string) {
    const current = await this.levelSexologyOfCustomerRepository.typeOrm
      .createQueryBuilder('this')
      .leftJoin('this.levelSexology', 'level_sexology')
      .where('this.userId = :userId', { userId })
      .select([
        'this.isCompleted',
        'this.id',
        'this.index',
        'this.currentLearnDays',
        'level_sexology.name',
        'level_sexology.pathThumbnailToPreview',
        'level_sexology.totalDaysMustLearn',
      ])
      .orderBy('this.index', 'DESC')
      .getOne();

    if (current) {
      return { data: current, isPracticeAtLeastOne: true };
    }

    const levelOne = await this.levelSexologyRepository.typeOrm
      .createQueryBuilder('this')
      .leftJoin('this.module', 'module')
      .where('this.status = TRUE')
      .select(['this.id', 'this.name', 'this.index', 'this.pathThumbnailToPreview', 'this.totalDaysMustLearn'])
      .orderBy('module.index', 'ASC')
      .addOrderBy('this.index', 'ASC')
      .getOne();

    return { data: levelOne, isPracticeAtLeastOne: false };
  }
}
