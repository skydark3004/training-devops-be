import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { EnumResponseError } from '../notification.enum';
import { HelperParent } from '../notification.helper-parent';
import { GetAllNotificationDto, ListNotificationDto } from './dto';
import { NotificationMapUserRepository, NotificationRepository } from 'src/module-repository/repository';
import { convertFullPathToPreview } from 'src/common';
import { EntityManager } from 'typeorm';
import { NotificationEntity, NotificationMapUserEntity } from 'src/core/entity';

@Injectable()
export class NotificationServiceMobile {
  constructor(
    private helperParent: HelperParent,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationMapUserRepository: NotificationMapUserRepository,
  ) {}

  async getList(query: ListNotificationDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {
      status: true,
    };

    if (query.type) {
      conditions.type = query.type;
    }

    const list = await this.notificationRepository.findWithPaginate({
      conditions,
      pagination,
      order: { createdAt: 'DESC' },
    });

    for (const el of list.data) {
      el.pathThumbnailToPreview = convertFullPathToPreview(el.pathThumbnail);
    }

    return list;
  }

  async getAll(query: GetAllNotificationDto, userId: string) {
    const queryBuilder = this.notificationRepository.typeOrm
      .createQueryBuilder('notification')
      .where('notification.status = TRUE')
      .leftJoinAndMapOne(
        'notification.likeBy', // tên field sau khi map sẽ trả ra khi return json
        'notification_map_user', // tên table
        'notification_map_user', // alias
        `notification.id = notification_map_user.notificationId AND notification_map_user.userId = :userId`,
        { userId },
      )
      .orderBy('notification.date', 'ASC');

    if (query.type) {
      queryBuilder.andWhere('notification.type = :type', { type: query.type });
    }

    const list = await queryBuilder.getMany();

    for (const el of list) {
      el.pathThumbnailToPreview = convertFullPathToPreview(el.pathThumbnail);
    }

    return list;
  }

  async getById(id: string) {
    const getById = await this.notificationRepository.findOneByParams({ conditions: { id, status: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.NOTIFICATION_NOT_FOUND);

    getById.pathThumbnailToPreview = convertFullPathToPreview(getById.pathThumbnail);

    return getById;
  }

  async likeNotificationById(id: string, userId: string) {
    const getById = await this.notificationRepository.findOneByParams({ conditions: { id, status: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.NOTIFICATION_NOT_FOUND);

    const isLiked = await this.notificationMapUserRepository.findOneByParams({ conditions: { userId: userId, notificationId: id } });

    await this.notificationRepository.useTransaction(async (entityManager: EntityManager) => {
      const rawNotificationRepo = entityManager.getRepository(NotificationEntity);
      const rawNotificationMapUserRepo = entityManager.getRepository(NotificationMapUserEntity);

      if (!isLiked) {
        await Promise.all([
          rawNotificationMapUserRepo.save({ notificationId: getById.id, userId }),
          rawNotificationRepo.update({ id }, { totalLikes: getById.totalLikes + 1 }),
        ]);
      }
    });

    return { message: 'Yêu thích thành công' };
  }
}
