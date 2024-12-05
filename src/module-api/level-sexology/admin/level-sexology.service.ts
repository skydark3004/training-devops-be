import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { EnumResponseError } from '../level-sexology.enum';
import { LevelSexologyHelper } from '../level-sexology.helper';
import { CreateLevelSexologyDto, ListLevelSexologyDto, UpdateLevelSexologyDto } from './dto';
import { EntityManager, ILike, In, Not } from 'typeorm';
import { ExerciseRepository, LevelSexologyRepository, ModuleRepository, TempFileRepository } from 'src/module-repository/repository';
import { LevelSexologyEntity, LevelSexologyMapExerciseEntity, TempFileEntity } from 'src/core/entity';
import { arrayUnique } from 'src/libs/utils';
import { convertFullPathToPreview, deleteFilesInFolder } from 'src/common';

@Injectable()
export class LevelSexologyServiceAdmin {
  constructor(
    private readonly levelSexologyHelper: LevelSexologyHelper,
    private readonly levelSexologyRepository: LevelSexologyRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getList(query: ListLevelSexologyDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    const list = await this.levelSexologyRepository.findWithPaginate({
      conditions,
      pagination,
      //select: this.levelSexologyRepository.getSelectColumns({ columns: ['details', 'guideVideos', 'thumbnail'], type: 'EXCEPT' }),
      relations: { listExercises: true },
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.levelSexologyRepository.findById(id, { relations: { listExercises: true, module: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return getById;
  }

  async create(body: CreateLevelSexologyDto) {
    const exerciseIds = arrayUnique(body.listExericses.map((exercise) => exercise.exerciseId));

    const [/* getByName, */ isExistByIndex, exercises] = await Promise.all([
      /* this.levelSexologyRepository.findOneByParams({ conditions: { name: body.name, moduleId: body.moduleId } }), */
      this.levelSexologyRepository.typeOrm.exists({ where: { index: body.index, moduleId: body.moduleId } }),
      this.exerciseRepository.findAllByParams({ conditions: { id: In(exerciseIds) } }),
    ]);

    /*  if (getByName) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`); */
    if (isExistByIndex) throw new BadRequestException(`Đã tồn tại level với thứ tự ${body.index}`);
    if (exercises.length !== exerciseIds.length) {
      throw new BadRequestException('Không tìm thấy ít nhất 1 bài tập');
    }

    if (body.pathThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.pathThumbnail);
      if (!isExist) throw new BadRequestException('Không tìm thấy ảnh');
    }

    const result = await this.levelSexologyRepository.useTransaction(async (entityManager) => {
      const levelSexology = await entityManager.save(LevelSexologyEntity, {
        name: body.name,
        status: body.status,
        moduleId: body.moduleId,
        listExercises: body.listExericses,
        isFree: body.isFree,
        index: body.index,
        totalDaysMustLearn: body.totalDaysMustLearn,
        totalTimesToPractice: body.totalTimesToPractice,
        typeOfPractice: body.typeOfPractice,
        pathThumbnail: body.pathThumbnail,
        pathThumbnailToPreview: convertFullPathToPreview(body.pathThumbnail),
      });

      if (body.pathThumbnail) {
        await this.tempFileRepository.typeOrm.delete({ path: body.pathThumbnail });
      }

      return levelSexology;
    });

    return result;
  }

  async updateById(id: string, body: UpdateLevelSexologyDto) {
    const exerciseIds = arrayUnique(body.listExericses.map((exercise) => exercise.exerciseId));

    const [getById, exercises] = await Promise.all([
      this.levelSexologyRepository.findOneByParams({
        conditions: { id },
        relations: { listExercises: true },
      }),
      this.exerciseRepository.findAllByParams({ conditions: { id: In(exerciseIds), moduleId: body.moduleId } }),
    ]);

    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    if (exercises.length !== exerciseIds.length) {
      throw new BadRequestException('Không tìm thấy ít nhất 1 bài tập');
    }

    if (body.moduleId !== getById.moduleId) {
      await this.moduleRepository.typeOrm.findOneOrFail({ where: { id: body.moduleId } });
    }

    if (getById.index !== body.index) {
      const isExistByIndex = await this.levelSexologyRepository.typeOrm.exists({ where: { index: body.index, id: Not(id), moduleId: getById.id } });
      if (isExistByIndex) throw new BadRequestException(`Đã tồn tại level với thứ tự ${body.index}`);
    }

    // nếu upload file mới
    const isUploadNewThumbnail = body.pathThumbnail && body.pathThumbnail !== getById.pathThumbnail;
    if (isUploadNewThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.pathThumbnail);
      if (!isExist) throw new BadRequestException('Không tồn tại file');
    }

    /*     if (getById.name !== body.name) {
      const isExistByIndex = await this.levelSexologyRepository.typeOrm.exists({ where: { name: body.name, id: Not(id), moduleId: getById.id } });
      if (isExistByIndex) throw new BadRequestException(`Đã tồn tại level với tên ${body.name}`);
    } */

    const { listIdsLevelSexologyMapToDelete, paramToInsertLevelSexologyMapExercise, listParamToUpdateLevelSexologyMap } =
      this.levelSexologyHelper.getParamToUpdateLevelSexology(getById, body);

    const callback = async (manager: EntityManager) => {
      const rawLevelSexologyRepository = manager.getRepository(LevelSexologyEntity);
      const rawLevelSexologyMapExerciseRepository = manager.getRepository(LevelSexologyMapExerciseEntity);
      const rawTempFileRepository = manager.getRepository(TempFileEntity);

      const listPromises: Promise<any>[] = [
        rawLevelSexologyRepository.update(
          { id },
          {
            ..._.pick(body, [
              'name',
              'moduleId',
              'isFree',
              'status',
              'index',
              'totalDaysMustLearn',
              'totalTimesToPractice',
              'typeOfPractice',
              'pathThumbnail',
            ]),
            pathThumbnailToPreview: body.pathThumbnail ? convertFullPathToPreview(body.pathThumbnail) : null,
          },
        ),
        rawLevelSexologyMapExerciseRepository.save(paramToInsertLevelSexologyMapExercise),
      ];

      if (listIdsLevelSexologyMapToDelete.length) {
        listPromises.push(rawLevelSexologyMapExerciseRepository.softDelete({ id: In(listIdsLevelSexologyMapToDelete) }));
      }

      for (const el of listParamToUpdateLevelSexologyMap) {
        listPromises.push(rawLevelSexologyMapExerciseRepository.update({ id: el.id }, { exerciseId: el.exerciseId, index: el.index }));
      }

      if (isUploadNewThumbnail) {
        listPromises.push(rawTempFileRepository.delete({ path: body.pathThumbnail }));
      }

      await Promise.all(listPromises);
    };
    await this.levelSexologyRepository.useTransaction(callback);

    const isDeleteThumbnail = (body.pathThumbnail === null && getById.pathThumbnail) || (isUploadNewThumbnail && getById.pathThumbnail);
    if (isDeleteThumbnail) {
      deleteFilesInFolder(getById.pathThumbnail);
    }

    return await this.getById(id);
  }
}
