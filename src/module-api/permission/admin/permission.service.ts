import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ResponseErrorEnum } from './permission.enum';
import { PermissionHelper } from './permission.helper';
import { CreatePermissionDto, ListPermissionDto, UpdatePermissionDto } from './permission.dto';
import { PermissionRepository } from 'src/module-repository/repository';
import { ArrayContains, ILike } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    private helper: PermissionHelper,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getList(query: ListPermissionDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {};
    if (query.name) {
      conditions.name = ILike(`%${query.name}%`);
    }
    if (query.status) {
      conditions.status = query.status;
    }

    if (query.permissionCodes) {
      console.log(query.permissionCodes);
      conditions.details = ArrayContains(query.permissionCodes);
    }

    const list = await this.permissionRepository.findWithPaginate({ conditions, pagination });

    return list;
  }

  async getById(id: string) {
    const getById = await this.permissionRepository.findOneBy({ id });
    if (!getById) throw new BadRequestException(ResponseErrorEnum.PERMISSION_NOT_FOUND);

    return getById;
  }

  async create(body: CreatePermissionDto) {
    const getByName = await this.permissionRepository.findOneBy({ name: body.name });
    if (getByName) throw new BadRequestException(`${ResponseErrorEnum.PERMISSION_EXIST} với tên ${body.name}`);

    const entity = this.permissionRepository.create(body);
    const create = await this.permissionRepository.save(entity);

    return create;
  }

  async updateById(id: string, body: UpdatePermissionDto) {
    const getById = await this.permissionRepository.findOneBy({ id });
    if (!getById) throw new BadRequestException(ResponseErrorEnum.PERMISSION_NOT_FOUND);

    const updateParams: any = {};

    if (body.name) {
      const getByName = await this.permissionRepository.findOneBy({ name: body.name });
      if (getByName && body.name !== getByName.name) throw new BadRequestException(`${ResponseErrorEnum.PERMISSION_EXIST} với tên ${body.name}`);
      updateParams.name = body.name;
    }

    if (body.details && body.details.length) updateParams.details = body.details;

    if (body.status) updateParams.status = body.status;

    await this.permissionRepository.update({ id }, updateParams);
    const result = await this.permissionRepository.findOneBy({ id });

    return result;
  }
}
