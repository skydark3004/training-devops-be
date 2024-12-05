import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { EnumResponseError } from '../faq.enum';
import { HelperParent } from '../faq.helper-parent';
import { CreateFaqDto, ListFaqDto, UpdateFaqDto } from './dto';
import { EntityManager, ILike, In } from 'typeorm';
import { FaqRepository, TempFileRepository } from 'src/module-repository/repository';
import { EnumTypeOfFaq } from 'src/core/enum';
import { FaqEntity, TempFileEntity } from 'src/core/entity';
import { convertFullPathToPreview, deleteFilesInFolder } from 'src/common';

@Injectable()
export class FaqServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private readonly faqRepository: FaqRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getList(query: ListFaqDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.title = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    if (query.type) {
      conditions.type = query.type;
    }

    const list = await this.faqRepository.findWithPaginate({
      conditions,
      pagination,
      select: {
        id: true,
        title: true,
        type: true,
        createdByUser: { id: true, fullName: true },
        createdAt: true,
        status: true,
      },
      relations: { createdByUser: true },
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.faqRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.FAQ_NOT_FOUND);

    getById.pathThumbnailToPreview = convertFullPathToPreview(getById.pathThumbnail);
    getById.pathVideoToPreview = convertFullPathToPreview(getById.pathVideo);

    return this.faqRepository.convertThumbnail(getById);
  }

  async create(body: CreateFaqDto, userId: string) {
    const getByName = await this.faqRepository.findOneByParams({ conditions: { title: body.title } });
    if (getByName) throw new BadRequestException(`${EnumResponseError.FAQ_EXIST} với tiêu đề ${body.title}`);

    const listPathsNeedToDeleteInDb = [];
    if (body.type === EnumTypeOfFaq.VIDEO) {
      const isExist = await this.tempFileRepository.typeOrm.exists({ where: { path: body.pathVideo } });
      if (!isExist) throw new BadRequestException('Không tồn tại video');
      listPathsNeedToDeleteInDb.push(body.pathVideo);
    }

    if (body.pathThumbnail) {
      const isExistThumbnail = await this.tempFileRepository.typeOrm.exists({ where: { path: body.pathThumbnail } });
      if (!isExistThumbnail) throw new BadRequestException('Không tồn tại thumbnail');
      listPathsNeedToDeleteInDb.push(body.pathThumbnail);
    }

    const result = await this.faqRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawFaqRepo = entityManager.getRepository(FaqEntity);
      const rawTempFileRepo = entityManager.getRepository(TempFileEntity);

      const paramToCreate: any = {
        ...body,
        createdByUserId: userId,
      };
      const faq = await rawFaqRepo.save(paramToCreate, { transaction: false });

      if (listPathsNeedToDeleteInDb.length) {
        await rawTempFileRepo.delete({ path: In(listPathsNeedToDeleteInDb) });
      }

      return faq;
    });

    return result;
  }

  async updateById(id: string, body: UpdateFaqDto) {
    const getById = await this.faqRepository.findOneByParams({ conditions: { id } });
    if (!getById) throw new BadRequestException(EnumResponseError.FAQ_NOT_FOUND);

    const listFilesNeedToDelete = [];
    const listPathsNeedToDeleteInDb = [];
    const paramsToUpdate = _.pick(body, ['title', 'type', 'pathThumbnail', 'status', 'typeOfShow']);

    // nếu upload file mới
    const isUploadNewThumbnail = body.pathThumbnail && body.pathThumbnail !== getById.pathThumbnail;
    if (isUploadNewThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.pathThumbnail);
      if (!isExist) throw new BadRequestException('Không tồn tại file');
      listPathsNeedToDeleteInDb.push(body.pathThumbnail);
    }

    const isDeleteThumbnail = (body.pathThumbnail === null && getById.pathThumbnail) || (isUploadNewThumbnail === true && getById.pathThumbnail);
    if (isDeleteThumbnail) {
      listFilesNeedToDelete.push(getById.pathThumbnail);
    }

    // nếu type hiện tại là VIDEO
    if (body.type === EnumTypeOfFaq.VIDEO) {
      if (getById.type !== body.type || getById.pathVideo !== body.pathVideo) {
        const isExist = await this.tempFileRepository.findByPath(body.pathVideo);
        if (!isExist) throw new BadRequestException('Không tồn tại video');
        listPathsNeedToDeleteInDb.push(body.pathVideo);

        if (getById.pathVideo) {
          listFilesNeedToDelete.push(getById.pathVideo);
        }
      }

      paramsToUpdate.content = null;
      paramsToUpdate.pathVideo = body.pathVideo;
      paramsToUpdate.url = null;
    }

    if (body.type === EnumTypeOfFaq.ARTICLE) {
      if (getById.type === EnumTypeOfFaq.VIDEO) {
        listFilesNeedToDelete.push(getById.pathVideo);
      }

      paramsToUpdate.pathVideo = null;
      paramsToUpdate.content = body.content;
      paramsToUpdate.url = null;
    }

    if (body.type === EnumTypeOfFaq.URL) {
      if (getById.type === EnumTypeOfFaq.VIDEO) {
        listFilesNeedToDelete.push(getById.pathVideo);
      }

      paramsToUpdate.pathVideo = null;
      paramsToUpdate.content = null;
      paramsToUpdate.url = body.url;
    }
    await this.faqRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawFaqRepo = entityManager.getRepository(FaqEntity);
      const rawTempFileRepo = entityManager.getRepository(TempFileEntity);

      if (listPathsNeedToDeleteInDb.length) await rawTempFileRepo.delete({ path: In(listPathsNeedToDeleteInDb) });
      await rawFaqRepo.update(id, paramsToUpdate);
    });

    if (listFilesNeedToDelete.length) {
      deleteFilesInFolder(listFilesNeedToDelete);
    }

    return await this.getById(id);
  }
}
