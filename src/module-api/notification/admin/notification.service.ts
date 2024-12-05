import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { EnumResponseError } from '../notification.enum';
import { CreateNotificationDto, ListNotificationDto, UpdateNotificationDto } from './dto';
import { EntityManager, ILike, In } from 'typeorm';
import { NotificationRepository, TempFileRepository } from 'src/module-repository/repository';
import { NotificationEntity, TempFileEntity } from 'src/core/entity';
import { convertFullPathToPreview, deleteFilesInFolder } from 'src/common';
import { EnumTypeOfContent } from 'src/core/enum';

@Injectable()
export class NotificationServiceAdmin {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getList(query: ListNotificationDto) {
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

    const list = await this.notificationRepository.findWithPaginate({
      conditions,
      pagination,
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.notificationRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.NOTIFICATION_NOT_FOUND);

    getById.pathThumbnailToPreview = convertFullPathToPreview(getById.pathThumbnail);

    return getById;
  }

  async create(body: CreateNotificationDto) {
    const getByName = await this.notificationRepository.findOneByParams({ conditions: { title: body.title, type: body.type } });
    if (getByName) throw new BadRequestException(`${EnumResponseError.NOTIFICATION_EXIST} với tiêu đề ${body.title}`);

    const listPathsNeedToDeleteInDb = [];

    if (body.pathThumbnail) {
      const isExistThumbnail = await this.tempFileRepository.typeOrm.exists({ where: { path: body.pathThumbnail } });
      if (!isExistThumbnail) throw new BadRequestException('Không tồn tại thumbnail');
      listPathsNeedToDeleteInDb.push(body.pathThumbnail);
    }

    const paramTocreate = _.pick(body, ['title', 'date', 'description', 'pathThumbnail', 'type', 'status', 'isNotifyForCustomer', 'typeOfContent']);

    if (body.typeOfContent === EnumTypeOfContent.ARTICLE) {
      paramTocreate.content = body.content;
    } else if (body.typeOfContent === EnumTypeOfContent.URL) {
      paramTocreate.url = body.url;
    }

    const result = await this.notificationRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawNotificationRepo = entityManager.getRepository(NotificationEntity);
      const rawTempFileRepo = entityManager.getRepository(TempFileEntity);

      const notification = await rawNotificationRepo.save(paramTocreate);

      if (listPathsNeedToDeleteInDb.length) {
        await rawTempFileRepo.delete({ path: In(listPathsNeedToDeleteInDb) });
      }

      return notification;
    });

    return result;
  }

  async updateById(id: string, body: UpdateNotificationDto) {
    const getById = await this.notificationRepository.findOneByParams({ conditions: { id } });
    if (!getById) throw new BadRequestException(EnumResponseError.NOTIFICATION_NOT_FOUND);

    const listFilesNeedToDelete = [];
    const listPathsNeedToDeleteInDb = [];
    const paramsToUpdate = _.pick(body, ['title', 'date', 'description', 'pathThumbnail', 'type', 'status', 'typeOfContent']);

    if (body.typeOfContent === EnumTypeOfContent.ARTICLE) {
      paramsToUpdate.content = body.content;
      paramsToUpdate.url = null;
    } else if (body.typeOfContent === EnumTypeOfContent.URL) {
      paramsToUpdate.url = body.url;
      paramsToUpdate.content = null;
    }

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

    await this.notificationRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawNotificationRepo = entityManager.getRepository(NotificationEntity);
      const rawTempFileRepo = entityManager.getRepository(TempFileEntity);

      if (listPathsNeedToDeleteInDb.length) await rawTempFileRepo.delete({ path: In(listPathsNeedToDeleteInDb) });
      await rawNotificationRepo.update(id, paramsToUpdate);
    });

    if (listFilesNeedToDelete.length) {
      deleteFilesInFolder(listFilesNeedToDelete);
    }

    return await this.getById(id);
  }
}
