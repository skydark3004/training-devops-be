import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumResponseError } from '../nutrition.enum';
import { HistoryReadNutritionRepository, NutritionRepository, PurchaseRepository } from 'src/module-repository/repository';

@Injectable()
export class NutritionServiceMobile {
  constructor(
    private readonly nutritionRepository: NutritionRepository,
    private readonly historyReadNutritionRepository: HistoryReadNutritionRepository,
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async getById(id: string, userId: string) {
    const [getById, isVip] = await Promise.all([
      this.nutritionRepository.findOneByParams({ conditions: { id, status: true } }),
      this.purchaseRepository.findOneByParams({ conditions: { userId: userId, isUseNow: true } }),
    ]);
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    if (!getById.isFree && !isVip) {
      throw new BadRequestException('Bạn phải nâng cấp tài khoản thì mới có thể xem bài viết này');
    }

    return this.nutritionRepository.convertThumbnail(getById);
  }

  async markAsReadById(id: string, userId: string) {
    const getById = await this.nutritionRepository.findOneByParams({ conditions: { id, status: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    const history = await this.historyReadNutritionRepository.findOneByParams({ conditions: { userId } });

    if (history?.listInObject?.[history?.id]) {
      return { message: 'Thành công' };
    }

    if (history) {
      const listInArray = [...history.listInArray, id];
      const listInObject = { ...history.listInObject, [id]: true };
      await this.historyReadNutritionRepository.typeOrm.update({ id: history.id }, { listInArray, listInObject });
    } else {
      await this.historyReadNutritionRepository.saveWithoutTransaction({ userId, listInArray: [id], listInObject: { [id]: true } });
    }

    return { message: 'Thành công' };
  }
}
