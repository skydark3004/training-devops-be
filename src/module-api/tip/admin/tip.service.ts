import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { EnumResponseError } from '../tip.enum';
import { HelperParent } from '../tip.helper-parent';
import { CreateTipDto, ListTipDto, UpdateTipDto } from './dto';
import { ILike } from 'typeorm';
import { TipRepository, TempFileRepository } from 'src/module-repository/repository';

@Injectable()
export class TipServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private readonly tipRepository: TipRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getList(query: ListTipDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.content = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    const list = await this.tipRepository.findWithPaginate({
      conditions,
      pagination,
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.tipRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.TIP_NOT_FOUND);

    return getById;
  }

  async create(body: CreateTipDto) {
    const result = await this.tipRepository.saveWithoutTransaction(body);

    return result;
  }

  async updateById(id: string, body: UpdateTipDto) {
    const getById = await this.tipRepository.findOneByParams({ conditions: { id } });
    if (!getById) throw new BadRequestException(EnumResponseError.TIP_NOT_FOUND);

    await this.tipRepository.typeOrm.update({ id }, body);

    return await this.getById(id);
  }
}
