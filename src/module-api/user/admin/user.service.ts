import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ResponseErrorEnum } from './user.enum';
import { UserHelper } from './user.helper';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './user.dto';
import { PermissionRepository, UserRepository } from 'src/module-repository/repository';
import { ILike } from 'typeorm';
import { hashPassword } from 'src/libs/utils';
import { RoleCodeEnum } from 'src/core/enum';

@Injectable()
export class UserService {
  constructor(
    private helper: UserHelper,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getList(query: ListUserDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const conditions: any = {
      roleCode: RoleCodeEnum.EMPLOYEE,
    };
    if (query.username) {
      conditions.username = ILike(`%${query.username}%`);
    }
    if (query.status) {
      conditions.status = query.status;
    }
    if (query.phoneNumber) {
      conditions.phoneNumber = ILike(`%${query.phoneNumber}%`);
    }

    if (query.permissionId) {
      const permission = await this.permissionRepository.findById(query.permissionId);
      if (!permission) throw new BadRequestException('Không tìm thấy quyền hạn');
      conditions.permission = {};
      conditions.permission.id = query.permissionId;
    }

    const list = await this.userRepository.findWithPaginate({
      conditions,
      pagination,
      relations: {
        permission: true,
      },
    });

    return list;
  }

  async getById(id: string) {
    const getById = await this.userRepository.findById(id, { relations: { permission: true } });
    if (!getById) throw new BadRequestException(ResponseErrorEnum.USER_NOT_FOUND);
    return getById;
  }

  async create(body: CreateUserDto) {
    const getByUsername = await this.userRepository.findOneBy({ username: body.username });
    if (getByUsername) throw new BadRequestException(`${ResponseErrorEnum.USER_EXIST} với ${body.username}`);

    const paramToCreate: any = {
      username: body.username,
      fullName: body.fullName,
      description: body.description,
      password: await hashPassword(body.password),
      phoneNumber: body.phoneNumber,
      gender: body.gender,
      roleCode: body.roleCode,
      status: body.status,
    };

    const permission = await this.permissionRepository.findById(body.permissionId);
    if (!permission) throw new BadRequestException('Không tìm thấy quyền hạn');
    paramToCreate.permission = body.permissionId;

    const entity = this.userRepository.create(paramToCreate);

    const create: any = await this.userRepository.save(entity);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = create;

    return rest;
  }

  async updateById(id: string, body: UpdateUserDto) {
    console.log('body:', body);
    const getById = await this.userRepository.findOneBy({ id });
    if (!getById) throw new BadRequestException(ResponseErrorEnum.USER_NOT_FOUND);

    const updateParams: any = {};

    if (body.status) updateParams.status = body.status;

    if (body.description) updateParams.description = body.description;

    if (body.fullName) updateParams.fullName = body.fullName;

    if (body.phoneNumber) updateParams.phoneNumber = body.phoneNumber;

    if (body.permissionId) {
      const permission = await this.permissionRepository.findById(body.permissionId);
      if (!permission) throw new BadRequestException('Không tìm thấy quyền hạn');
      updateParams.permission = body.permissionId;
    }

    if (body.gender) updateParams.gender = body.gender;

    if (body.status) updateParams.status = body.status;

    console.log('updateParams::', updateParams);

    await this.userRepository.update({ id }, updateParams);
    const result = await this.userRepository.findOneBy({ id });

    return result;
  }
}
