import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { EnumResponseError } from './user.enum';
import { CreateEmployeeDto, ListEmployeeDto, UpdateEmployeeDto } from './dto';
import { PermissionRepository, UserRepository } from 'src/module-repository/repository';
import { hashPassword } from 'src/libs/utils';
import { EnumPrefixRedis, EnumRoleCode } from 'src/core/enum';

@Injectable()
export class UserServiceAdmin {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getList(query: ListEmployeeDto) {
    const pagination = _.pick(query, ['page', 'pageSize']);

    const queryBuilder = this.userRepository.typeOrm.createQueryBuilder('user').leftJoinAndSelect('user.permission', 'permission').where('1=1');

    if (query.keySearch) {
      queryBuilder.andWhere('(user.fullName ILIKE :keySearch OR user.username ILIKE :keySearch OR user.phoneNumber ILIKE :keySearch)', {
        keySearch: `%${query?.keySearch}%`,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('user.status = :status', { status: query.status });
    }

    if (query.roleCode) {
      queryBuilder.andWhere('user.roleCode = :roleCode', { roleCode: query.roleCode });
    }

    if (query.permissionId) {
      queryBuilder.andWhere('permission.id = :permissionId', { permissionId: query.permissionId });
    }

    const list = await this.userRepository.queryBuilderWithPaginate({ pagination: pagination, queryBuilder });

    return list;
  }

  async getById(id: string) {
    const getById = await this.userRepository.typeOrm
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.permission', 'permission')
      .where('user.id = :id', { id })
      .select([
        'user.id',
        'user.username',
        'user.fullName',
        'user.phoneNumber',
        'user.permissionId',
        'user.status',
        'user.description',
        'user.permission',
        'user.roleCode',
        'permission.id',
        'permission.name',
        'permission.details',
      ])
      .getOne();
    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    return getById;
  }

  async create(body: CreateEmployeeDto) {
    const getByUsername = await this.userRepository.typeOrm.findOneBy({ username: body.username });
    if (getByUsername) throw new BadRequestException(`${EnumResponseError.USER_EXIST} với email ${body.username}`);

    const permission = await this.permissionRepository.findById(body.permissionId);
    if (!permission) throw new BadRequestException('Không tìm thấy quyền hạn');

    const paramToCreate: any = {
      username: body.username,
      fullName: body.fullName,
      description: body.description,
      password: await hashPassword(body.password),
      phoneNumber: body.phoneNumber,
      roleCode: EnumRoleCode.EMPLOYEE,
      status: body.status,
      permissionId: body.permissionId,
    };

    const entity = this.userRepository.typeOrm.create(paramToCreate);

    const create: any = await this.userRepository.typeOrm.save(entity);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = create;

    return rest;
  }

  async updateById(id: string, body: UpdateEmployeeDto) {
    const getById = await this.userRepository.typeOrm.findOneBy({ id });
    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const updateParams: any = _.pick(body, ['fullName', 'phoneNumber', 'status', 'description']);

    if (body.permissionId) {
      const permission = await this.permissionRepository.findById(body.permissionId);
      if (!permission) throw new BadRequestException('Không tìm thấy quyền hạn');
      updateParams.permissionId = body.permissionId;
    }

    await this.userRepository.typeOrm.update({ id }, updateParams);
    const result = await this.getById(id);

    return result;
  }
}
