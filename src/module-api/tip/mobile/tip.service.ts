import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumResponseError } from '../tip.enum';
import { HelperParent } from '../tip.helper-parent';
import { TipRepository } from 'src/module-repository/repository';

@Injectable()
export class TipServiceMobile {
  constructor(
    private helperParent: HelperParent,
    private readonly tipRepository: TipRepository,
  ) {}

  async getAllTips() {
    const list = await this.tipRepository.typeOrm.find({
      where: { status: true },
      order: { createdAt: 'DESC' },
    });

    return list;
  }

  async getById(id: string) {
    const getById = await this.tipRepository.findOneByParams({ conditions: { id, status: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.TIP_NOT_FOUND);

    return getById;
  }
}
