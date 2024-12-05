import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { EnumResponseError } from './level.enum';
import { CreateLevelDto, ListLevelDto, UpdateLevelDto } from './dto';
import { EntityManager, ILike, In } from 'typeorm';
import { ExerciseRepository, LevelRepository, TempFileRepository, UserRepository } from 'src/module-repository/repository';
import { LevelEntity, PracticeDayEntity, PracticeDayMapExerciseEntity, TempFileEntity } from 'src/core/entity';
import { LevelHelper } from '../level.helper';
import { deleteFilesInFolder } from 'src/common';
import { Message } from 'firebase-admin/messaging';

@Injectable()
export class LevelServiceAdmin {
  constructor(
    private readonly levelRepository: LevelRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly tempFileRepository: TempFileRepository,
    private readonly userRepository: UserRepository,
    private readonly levelHelper: LevelHelper,
  ) {}

  async getList(query: ListLevelDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    const list = await this.levelRepository.findWithPaginate({
      conditions,
      pagination,
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.levelRepository.typeOrm
      .createQueryBuilder('level')
      .leftJoinAndSelect('level.practiceDays', 'practice_day')
      .leftJoinAndSelect('practice_day.exercisesOfEachDay', 'practice_day_map_exercise')
      .leftJoinAndSelect('practice_day_map_exercise.exercise', 'exercise')
      .orderBy('practice_day.index', 'ASC')
      .addOrderBy('practice_day_map_exercise.index', 'ASC')
      .where('level.id = :levelId', { levelId: id })
      .getOne();
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return this.levelRepository.convertThumbnail(getById);
  }

  async create(body: CreateLevelDto) {
    const uniqueExerciseIds = this.levelHelper.getUniqueExerciseIds(body);

    const [getByName, countUniqueExercises] = await Promise.all([
      this.levelRepository.findOneByParams({ conditions: { name: body.name } }),
      this.exerciseRepository.typeOrm.count({ where: { id: In(uniqueExerciseIds) } }),
    ]);

    if (getByName) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`);
    if (uniqueExerciseIds.length !== countUniqueExercises) {
      throw new BadRequestException('Không tìm thấy ít nhất 1 bài tập');
    }

    if (body.pathThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.pathThumbnail);
      if (!isExist) throw new BadRequestException('Không tìm thấy file thumbnail');
    }

    const callback = async (manager: EntityManager) => {
      const rawLevelRepository = manager.getRepository(LevelEntity);
      const rawTempFileRepository = manager.getRepository(TempFileEntity);
      const rawPracticeDayRepository = manager.getRepository(PracticeDayEntity);
      const rawPracticeDayMapExerciseRepository = manager.getRepository(PracticeDayMapExerciseEntity);

      const level = await rawLevelRepository.save(
        {
          name: body.name,
          totalDaysToStudy: body.days.length,
          index: body.index,
          isFree: body.isFree,
          pathThumbnail: body.pathThumbnail,
          status: body.status,
        },
        { transaction: false },
      );

      for (const [index, day] of body.days.entries()) {
        const practiceDay = await rawPracticeDayRepository.save(
          {
            totalExercises: day.totalExercises,
            index: index + 1,
            levelId: level.id,
          },
          { transaction: false },
        );

        await Promise.all(
          day.details.map((el) => {
            return rawPracticeDayMapExerciseRepository.save(
              {
                index: el.index + 1,
                frequency: el.frequency,
                description: el.description,
                practiceDayId: practiceDay.id,
                exerciseId: el.exerciseId,
              },
              { transaction: false },
            );
          }),
        );
      }

      if (body.pathThumbnail) {
        await rawTempFileRepository.delete({ path: body.pathThumbnail });
      }

      return level;
    };
    const result = await this.levelRepository.useTransaction(callback);

    //notify cho user
    if (result.status) {
      this.notifyWhenHaveNewLevel();
    }

    return result;
  }

  async updateById(id: string, body: UpdateLevelDto) {
    const [getById, getByName] = await Promise.all([
      this.levelRepository.findOneByParams({ conditions: { id }, relations: { practiceDays: { exercisesOfEachDay: true } } }),
      this.levelRepository.findOneByParams({ conditions: { name: body.name } }),
    ]);

    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);
    if (getByName && getById.id !== getByName.id) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`);

    // nếu upload file mới
    const isUploadNewThumbnail = body.pathThumbnail && body.pathThumbnail !== getById.pathThumbnail;
    if (isUploadNewThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.pathThumbnail);
      if (!isExist) throw new BadRequestException('Không tồn tại file');
    }

    const {
      listIdsOfPracticeDaysToDelete,
      listParamToInsertPracticeDays,
      listParamToInsertPracticeDayMapExercise,
      listParamToUpdatePracticeDayMapExercise,
      listIdsOfPracticeDaysMapExerciseToDelete,
      listParamToUpdatePracticeDay,
    } = await this.levelHelper.getParamUpdateLevel(getById, body);

    const callback = async (manager: EntityManager) => {
      const rawLevelRepository = manager.getRepository(LevelEntity);
      const rawPracticeDayRepository = manager.getRepository(PracticeDayEntity);
      const rawPracticeDayMapExerciseRepository = manager.getRepository(PracticeDayMapExerciseEntity);
      const rawTempFileRepository = manager.getRepository(TempFileEntity);

      const listPromises: Promise<any>[] = [
        rawLevelRepository.update(
          { id },
          { ..._.pick(body, ['name', 'index', 'status', 'pathThumbnail', 'isFree']), totalDaysToStudy: body.days.length },
        ),
        rawPracticeDayRepository.save(listParamToInsertPracticeDays, { transaction: false }),
        rawPracticeDayMapExerciseRepository.save(listParamToInsertPracticeDayMapExercise, { transaction: false }),
      ];

      if (listIdsOfPracticeDaysMapExerciseToDelete.length) {
        listPromises.push(rawPracticeDayMapExerciseRepository.softDelete({ id: In(listIdsOfPracticeDaysMapExerciseToDelete) }));
      }

      if (listIdsOfPracticeDaysToDelete.length) {
        listPromises.push(rawPracticeDayRepository.softDelete({ id: In(listIdsOfPracticeDaysToDelete) }));
      }

      for (const el of listParamToUpdatePracticeDayMapExercise) {
        listPromises.push(
          rawPracticeDayMapExerciseRepository.update(
            { id: el.id },
            { index: el.index, frequency: el.frequency, description: el.description, exerciseId: el.exerciseId },
          ),
        );
      }

      for (const el of listParamToUpdatePracticeDay) {
        listPromises.push(rawPracticeDayRepository.update({ id: el.id }, { totalExercises: el.totalExercises, index: el.index }));
      }

      if (isUploadNewThumbnail) {
        listPromises.push(rawTempFileRepository.delete({ path: body.pathThumbnail }));
      }

      await Promise.all(listPromises);
    };
    await this.levelRepository.useTransaction(callback);

    const isDeleteThumbnail = (body.pathThumbnail === null && getById.pathThumbnail) || (isUploadNewThumbnail === true && getById.pathThumbnail);
    if (isDeleteThumbnail) {
      deleteFilesInFolder(getById.pathThumbnail);
    }

    // nếu đổi từ inactive -> active  thì notify
    if (!getById.status && body.status) {
      this.notifyWhenHaveNewLevel();
    }

    return await this.getById(id);
  }

  private async notifyWhenHaveNewLevel() {
    const users = await this.userRepository.typeOrm
      .createQueryBuilder('user')
      .where('jsonb_array_length(user.fcmToken) > 0')
      .select(['user.id', 'user.fcmToken'])
      .getMany();

    const messages: Message[] = users
      .map((el) =>
        el.fcmToken.map((token) => {
          return {
            token,
            notification: {
              title: 'Tương tác với huấn luyện viên',
              body: `${el.fullName || 'Bạn'} ơi. The Care vừa cập nhật thêm bài mới đó. Hay lắm. Vào xem nha`,
            },
          };
        }),
      )
      .flat(1);
  }
}
