import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from './module.enum';
import { CreateModuleDto, ListModuleDto, UpdateModuleDto } from './module.dto';
import { ModuleRepository, TempFileRepository } from 'src/module-repository/repository';
import { ILike, Not } from 'typeorm';
import { StringUtil } from 'src/libs/utils';
import { deleteFilesInFolder } from 'src/common';
import { EnumStudyProgramCode } from 'src/core/enum';

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getList(query: ListModuleDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }
    if (query.status) {
      conditions.status = query.status;
    }
    if (query.studyProgramCode) {
      conditions.studyProgramCode = query.studyProgramCode;
    }

    const list = await this.moduleRepository.findWithPaginate({
      conditions,
      pagination,
      relations: {
        createdByUser: true,
        excercises: true,
      },
      select: {
        ...this.moduleRepository.getSelectColumns({ columns: ['createdByUserId'], type: 'EXCEPT' }),
        createdByUser: {
          id: true,
          fullName: true,
          username: true,
        },
        excercises: {
          id: true,
          name: true,
        },
      },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.moduleRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.MODULE_NOT_FOUND);

    return getById;
  }

  async create(body: CreateModuleDto, userId: string) {
    const getByName = await this.moduleRepository.typeOrm.findOneBy({ name: body.name });
    if (getByName) throw new BadRequestException(`${EnumResponseError.MODULE_EXIST} với tên ${body.name}`);

    if (body.studyProgramCode === EnumStudyProgramCode.SEXOLOGY) {
      const isExistByIndex = await this.moduleRepository.typeOrm.exists({
        where: { studyProgramCode: EnumStudyProgramCode.SEXOLOGY, index: body.index },
      });
      if (isExistByIndex) throw new BadRequestException(`Đã tồn tại module với thứ tự ${body.index}`);
    }

    if (body.path) {
      const isExist = await this.tempFileRepository.findByPath(body.path);
      if (!isExist) throw new BadRequestException('Không tồn tại file');
    }

    const paramsToCreate: any = {
      ...body,
      createdByUserId: userId,
      index: body.studyProgramCode === EnumStudyProgramCode.SEXOLOGY ? body.index : null,
    };

    const entity = this.moduleRepository.typeOrm.create(paramsToCreate);
    const create = await this.moduleRepository.typeOrm.save(entity);

    if (body.path) {
      await this.tempFileRepository.typeOrm.delete({ path: body.path });
    }

    return create;
  }

  async updateById(id: string, body: UpdateModuleDto) {
    const getById = await this.moduleRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.MODULE_NOT_FOUND);

    const getByName = await this.moduleRepository.typeOrm.findOneBy({ name: body.name });
    if (getByName && getById.id !== getByName.id) throw new BadRequestException(`${EnumResponseError.MODULE_EXIST} với tên ${body.name}`);

    if (body.studyProgramCode === EnumStudyProgramCode.SEXOLOGY) {
      const isExistByIndex = await this.moduleRepository.typeOrm.exists({
        where: { studyProgramCode: EnumStudyProgramCode.SEXOLOGY, index: body.index, id: Not(id) },
      });
      if (isExistByIndex) throw new BadRequestException(`Đã tồn tại module với thứ tự ${body.index}`);
    }

    // nếu upload file mới
    const isUploadNewThumbnail = body.path !== null && body.path !== getById.path;
    if (isUploadNewThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.path);
      if (!isExist) throw new BadRequestException('Không tồn tại file');
    }

    const paramsToUpdate: any = {
      ...body,
      nameToSearch: StringUtil.convertVNToEnglish(body.name),
    };

    await this.moduleRepository.typeOrm.update({ id }, paramsToUpdate);

    if (isUploadNewThumbnail) {
      this.tempFileRepository.typeOrm.delete({ path: body.path });
    }

    const result = await this.moduleRepository.typeOrm.findOneBy({ id });

    const isDeleteThumbnail = (body.path === null && getById.path) || (isUploadNewThumbnail === true && getById.path);
    if (isDeleteThumbnail) {
      deleteFilesInFolder(getById.path);
    }

    return result;
  }
}
