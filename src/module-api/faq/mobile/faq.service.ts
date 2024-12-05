import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { EnumResponseError } from '../faq.enum';
import { HelperParent } from '../faq.helper-parent';
import { ListFaqDto } from './dto';
import { ILike } from 'typeorm';
import { FaqRepository } from 'src/module-repository/repository';
import { EnumTypeOfFaq } from 'src/core/enum';
import { convertFullPathToPreview } from 'src/common';

@Injectable()
export class FaqServiceMobile {
  constructor(
    private helperParent: HelperParent,
    private readonly faqRepository: FaqRepository,
  ) {}

  async getList(query: ListFaqDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {
      status: true,
    };
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
        url: true,
        typeOfShow: true,
        pathVideo: true,
        createdAt: true,
        status: true,
      },
      order: { createdAt: 'DESC' },
    });

    for (const el of list.data) {
      el.pathThumbnailToPreview = convertFullPathToPreview(el.pathThumbnail);

      if (el.type === EnumTypeOfFaq.VIDEO) {
        el.pathVideoToPreview = convertFullPathToPreview(el.pathVideo);
      }
    }

    return list;
  }

  async getAll() {
    const list = await this.faqRepository.findAllByParams({ conditions: { status: true } });
    for (const el of list) {
      el.pathThumbnailToPreview = convertFullPathToPreview(el.pathThumbnail);

      if (el.type === EnumTypeOfFaq.VIDEO) {
        el.pathVideoToPreview = convertFullPathToPreview(el.pathVideo);
      }
    }

    return list;
  }

  async getById(id: string) {
    const getById = await this.faqRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.FAQ_NOT_FOUND);

    getById.pathThumbnailToPreview = convertFullPathToPreview(getById.pathThumbnail);
    getById.pathVideoToPreview = convertFullPathToPreview(getById.pathVideo);

    return this.faqRepository.convertThumbnail(getById);
  }
}
