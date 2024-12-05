import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { EnumResponseError } from '../nutrition.enum';
import { CreateNutritionDto, ListNutritionDto, UpdateNutritionDto } from './dto';
import { EntityManager, ILike } from 'typeorm';
import { CategoryRepository, NutritionRepository, TempFileRepository } from 'src/module-repository/repository';
import { deleteFilesInFolder } from 'src/common';
import { NutritionEntity, TempFileEntity } from 'src/core/entity';

@Injectable()
export class NutritionServiceAdmin {
  constructor(
    private readonly tempFileRepository: TempFileRepository,
    private readonly nutritionRepository: NutritionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getList(query: ListNutritionDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.keySearch) {
      conditions.name = ILike(`%${query.keySearch}%`);
    }

    if (!_.isUndefined(query.status)) {
      conditions.status = query.status;
    }

    if (query.categoryId) {
      conditions.categoryId = query.categoryId;
    }

    const list = await this.nutritionRepository.findWithPaginate({
      conditions,
      pagination,
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
    return list;
  }

  async getById(id: string) {
    const getById = await this.nutritionRepository.findById(id);
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    return this.nutritionRepository.convertThumbnail(getById);
  }

  async create(body: CreateNutritionDto) {
    await this.categoryRepository.typeOrm.findOneOrFail({ where: { id: body.categoryId } });

    const getByName = await this.nutritionRepository.findOneByParams({ conditions: { name: body.name, categoryId: body.categoryId } });
    if (getByName) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`);

    const getByIndex = await this.nutritionRepository.findOneByParams({ conditions: { index: body.index, categoryId: body.categoryId } });
    if (getByIndex) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với thứ tự ${body.index}`);

    if (body.pathThumbnail) {
      await this.tempFileRepository.typeOrm.findOneOrFail({ where: { path: body.pathThumbnail } });
    }

    const responseFromTransaction = await this.nutritionRepository.useTransaction(async (entityManager: EntityManager) => {
      const nutrition = await entityManager.getRepository(NutritionEntity).save(body);
      await entityManager.getRepository(TempFileEntity).delete({ path: body.pathThumbnail });

      return nutrition;
    });

    return responseFromTransaction;
  }

  async updateById(id: string, body: UpdateNutritionDto) {
    const getById = await this.nutritionRepository.findOneByParams({ conditions: { id } });
    if (!getById) throw new BadRequestException(EnumResponseError.EXCERCISE_NOT_FOUND);

    // nếu upload file mới
    const isUploadNewThumbnail = body.pathThumbnail && body.pathThumbnail !== getById.pathThumbnail;
    if (isUploadNewThumbnail) {
      const isExist = await this.tempFileRepository.findByPath(body.pathThumbnail);
      if (!isExist) throw new BadRequestException('Không tồn tại file');
    }

    if (body.categoryId !== getById.categoryId) {
      const category = await this.categoryRepository.typeOrm.findOne({ where: { id: body.categoryId } });
      if (!category) throw new BadRequestException('Không tìm thấy danh mục dinh dưỡng');
    }

    const getByName = await this.nutritionRepository.findOneByParams({ conditions: { name: body.name, categoryId: body.categoryId } });
    if (getByName && getByName.id !== getById.id) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với tên ${body.name}`);

    const getByIndex = await this.nutritionRepository.findOneByParams({ conditions: { index: body.index, categoryId: body.categoryId } });
    if (getByIndex && getByIndex.id !== getById.id) throw new BadRequestException(`${EnumResponseError.EXCERCISE_EXIST} với thứ tự ${body.index}`);

    await this.nutritionRepository.typeOrm.update({ id }, body);

    if (isUploadNewThumbnail) {
      await this.tempFileRepository.typeOrm.delete({ path: body.pathThumbnail });
    }

    const isDeleteThumbnail = (body.pathThumbnail === null && getById.pathThumbnail) || (isUploadNewThumbnail && getById.pathThumbnail);
    if (isDeleteThumbnail) {
      deleteFilesInFolder(getById.pathThumbnail);
    }

    return await this.getById(id);
  }
}
