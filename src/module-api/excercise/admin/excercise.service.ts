import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from './excercise.enum';
import { HelperParent } from '../excercise.helper';
import { CreateExerciseDto, ListExerciseDto, UpdateExerciseDto } from './dto';

import { EntityManager, ILike, In } from 'typeorm';
import { ExerciseRepository, ModuleRepository } from 'src/module-repository/repository';
import { ExerciseEntity, TempFileEntity } from 'src/core/entity';

import { HelperAdmin } from './excercise.helper';
import { deleteFilesInFolder } from 'src/common';

@Injectable()
export class ExerciseServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private helperAdmin: HelperAdmin,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly moduleRepository: ModuleRepository,
  ) {}

  async getList(query: ListExerciseDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }
    if (query.moduleId) {
      conditions.moduleId = query.moduleId;
    }
    if (query.studyProgramCode) {
      conditions.module = { studyProgramCode: query.studyProgramCode };
    }

    const list = await this.exerciseRepository.findWithPaginate({
      conditions,
      pagination,
      select: this.exerciseRepository.getSelectColumns({ columns: ['details', 'guideVideos', 'thumbnail'], type: 'EXCEPT' }),
      relations: { module: true },
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.exerciseRepository.findById(id, { relations: { module: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return this.exerciseRepository.convertUrlToPreview(getById, {
      thumbnail: true,
      guideVideos: true,
      details: true,
    });
  }

  async create(body: CreateExerciseDto) {
    /*     const getByName = await this.exerciseRepository.findOneByParams({ conditions: { name: body.name } });
    if (getByName) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`); */

    const module = await this.moduleRepository.findById(body.moduleId);
    if (!module) throw new BadRequestException(`Không tìm thấy module`);

    const listTempFiles: string[] = [...(body?.guideVideos || [])];

    if (body.thumbnail) {
      listTempFiles.push(body.thumbnail);
    }

    const allFilesInAllSteps = this.helperAdmin.getAllFilesInAllSteps({ exerciseType: body.exerciseType, details: body.details });
    listTempFiles.push(...allFilesInAllSteps);

    const result = await this.exerciseRepository.typeOrm.manager.transaction(async (manager: EntityManager) => {
      const rawTempFileRepository = manager.getRepository(TempFileEntity);
      // xóa file temp
      if (listTempFiles.length) {
        const listTempFilesInDb = await rawTempFileRepository.find({ where: { path: In(listTempFiles) } });
        if (listTempFiles.length !== listTempFilesInDb.length) {
          throw new BadRequestException({ message: 'Không tìm thấy ít nhất 1 file', data: listTempFiles });
        }
        await rawTempFileRepository.delete({ path: In(listTempFiles) });
      }

      const paramsToCreate: any = {
        ...body,
      };
      const entity = manager.getRepository(ExerciseEntity).create(paramsToCreate);
      const create = await manager.getRepository(ExerciseEntity).save(entity);
      return create;
    });

    return result;
  }

  async updateById(id: string, body: UpdateExerciseDto) {
    const getById = await this.exerciseRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    /*     const getByName = await this.exerciseRepository.typeOrm.findOneBy({ name: body.name });
    if (getByName && getById.id !== getByName.id) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`); */

    const listFilesToDelete: string[] = []; // các file cần xóa
    const listTempFiles: string[] = [];

    const paramsToUpdate: any = {
      name: body.name,
      exerciseType: body.exerciseType,
      description: body.description,
      status: body.status,
      details: body.details,
    };

    if (getById.moduleId !== body.moduleId) {
      const module = await this.moduleRepository.findById(body.moduleId);
      if (!module) throw new BadRequestException(`Không tìm thấy module`);
      paramsToUpdate.moduleId = body.moduleId;
    }

    if (body.isDeletedThumbnail) {
      paramsToUpdate.thumbnail = null;
      listFilesToDelete.push(getById.thumbnail);
    }

    if (body.addThumbnail) {
      paramsToUpdate.thumbnail = body.addThumbnail;
      listTempFiles.push(body.addThumbnail);
      if (getById.thumbnail) listFilesToDelete.push(getById.thumbnail);
    }

    const newGuideVideos = [...getById.guideVideos];
    if (body?.deleteGuideVideos?.length) {
      for (const path of body.deleteGuideVideos) {
        const index = getById.guideVideos.findIndex((el) => el === path);
        if (index === -1) throw new BadRequestException('Không tồn tại đường dẫn video ' + path);
        newGuideVideos.splice(index, 1);
        listFilesToDelete.push(path);
      }
    }

    if (body?.addGuideVideos?.length) {
      for (const path of body.addGuideVideos) {
        listTempFiles.push(path);
        newGuideVideos.push(path);
      }
    }
    paramsToUpdate.guideVideos = newGuideVideos;

    const allFilesInAllStepsFromDb = this.helperAdmin.getAllFilesInAllSteps({ exerciseType: getById.exerciseType, details: getById.details });
    const allFilesInAllSteps = this.helperAdmin.getAllFilesInAllStepsWhenUpdate({
      exerciseType: body.exerciseType,
      details: body.details,
      listFilesFromDb: allFilesInAllStepsFromDb,
    });
    listTempFiles.push(...allFilesInAllSteps);

    const callback = async (manager: EntityManager) => {
      const rawTempFileRepository = manager.getRepository(TempFileEntity);
      const rawExerciseRepository = manager.getRepository(ExerciseEntity);

      // xóa file temp
      if (listTempFiles.length) {
        const listTempFilesInDb = await rawTempFileRepository.find({ where: { path: In(listTempFiles) } });
        if (listTempFiles.length !== listTempFilesInDb.length) {
          throw new BadRequestException({ message: 'Không tìm thấy ít nhất 1 file', data: listTempFiles });
        }
        await rawTempFileRepository.delete({ path: In(listTempFiles) });
      }
      const update = await rawExerciseRepository.update({ id }, paramsToUpdate);
      return update;
    };
    await this.exerciseRepository.useTransaction(callback);

    // xóa file video/ảnh cũ
    if (listFilesToDelete.length) {
      deleteFilesInFolder(listFilesToDelete);
    }

    return this.getById(id);
  }

  /*   handleFilesWhenChangeExerciseType(exercise: ExerciseEntity, body: any) {
    const listTemps = [];
    const listFilesNeedToDelete = [];

    //xử lí file temp hiện tại
    switch (body.exerciseType) {
      case EnumExcerciseType.VIDEO:
        for (const step of body.details as VideoDto[]) {
          if (step.typeOfScreen === EnumScreenTypeOfVideo.VIDEO) listTemps.push(step.path);
        }
        break;
      case EnumExcerciseType.REEL:
        for (const step of body.details as ReelDto[]) {
          listTemps.push(step.path);
        }
        break;
      case EnumExcerciseType.INFORMATION:
        break;
    }

    // xóa các file cũ
    switch (exercise.exerciseType) {
      case EnumExcerciseType.VIDEO:
        for (const step of exercise.details as VideoDto[]) {
          if (step.typeOfScreen === EnumScreenTypeOfVideo.VIDEO) listFilesNeedToDelete.push(step.path);
        }
        break;
      case EnumExcerciseType.REEL:
        for (const step of exercise.details as ReelDto[]) {
          listFilesNeedToDelete.push(step.path);
        }
        break;
      case EnumExcerciseType.INFORMATION:
        break;
    }

    return { listTemps, listFilesNeedToDelete };
  } */

  /*   handleStep(exercise: ExerciseEntity, body: any) {
    const listTemps: string[] = [];
    const listFilesNeedToDelete: string[] = [];

    switch (exercise.exerciseType) {
      case EnumExcerciseType.VIDEO:
        const newDetailsOfVideo = [];
        for (const [index, stepOfBody] of body.details.entries() as IterableIterator<[number, VideoDto]>) {
          // nếu không có giá trị tại index của dữ liệu hiện tại -> thêm 1 step
          if (!exercise.details[index]) {
            if (stepOfBody.typeOfScreen === EnumScreenTypeOfVideo.VIDEO) listTemps.push(stepOfBody.path);
            newDetailsOfVideo.push(stepOfBody);
            continue;
          }

          // nếu tồn tại -> check xem có thay đổi giá trị không?
          if (compareTwoObjectsWithFields(stepOfBody, exercise.details[index], ['path', 'typeOfScreen', 'content', 'nameOfButton'])) {
            newDetailsOfVideo.push(stepOfBody);
            continue;
          }

          if (!compareTwoObjectsWithFields(stepOfBody, exercise.details[index], ['path', 'typeOfScreen', 'content', 'nameOfButton'])) {
            // nếu vẫn là loại màn hình Video và upload file khác -> xóa file temp và xóa file cũ
            if (stepOfBody.typeOfScreen === EnumScreenTypeOfVideo.VIDEO && exercise.details[index].path !== stepOfBody?.path) {
              listTemps.push(stepOfBody.path);
              exercise.details[index].path && listFilesNeedToDelete.push(exercise.details[index].path);
            }

            // nếu thay đổi loại màn hình từ video sang 1 loại khác -> xóa file cũ
            if (exercise.details[index].typeOfScreen === EnumScreenTypeOfVideo.VIDEO && stepOfBody.typeOfScreen !== EnumScreenTypeOfVideo.VIDEO) {
              listFilesNeedToDelete.push(exercise.details[index].path);
            }
            newDetailsOfVideo.push(stepOfBody);
          }
        }

        break;

      case EnumExcerciseType.MUSCLE_PC:
        break;

      case EnumExcerciseType.REEL:
        const newDetailsOfReel = [];
        for (const [index, stepOfBody] of body.details.entries() as IterableIterator<[number, ReelDto]>) {
          // nếu không có giá trị tại index của dữ liệu hiện tại -> thêm 1 step
          if (!exercise.details[index]) {
            listTemps.push(stepOfBody.path);
            newDetailsOfReel.push(stepOfBody);
            continue;
          }

          // nếu upload file khác -> xóa file temp và xóa file cũ
          if (exercise.details[index].path !== stepOfBody?.path) {
            listTemps.push(stepOfBody.path);
            listFilesNeedToDelete.push(exercise.details[index].path);
          }
          newDetailsOfReel.push(stepOfBody);
        }
        break;

      case EnumExcerciseType.INFORMATION:
        //TODO:
        break;

      default:
        break;
    }

    return { listTemps, listFilesNeedToDelete };
  } */
}
