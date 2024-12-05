import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { UserServiceAdmin } from './user.service';

import { Auth, CurrentUser } from 'src/decorators';
import { EnumPermission, EnumRoleCode } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { CreateEmployeeDto, ListEmployeeDto, UpdateEmployeeDto } from './dto';

@Controller('/admin/user')
export class UserControllerAdmin {
  constructor(private userService: UserServiceAdmin) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.EMPLOYEE] })
  async getListEmloyee(@Query() query: ListEmployeeDto) {
    const res = await this.userService.getList(query);
    return res;
  }

  @Get('/me')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getMe(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.getById(currentUser.userId);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.EMPLOYEE] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.userService.getById(id);
    return res;
  }

  @Post('/create')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.EMPLOYEE] })
  async create(@Body() body: CreateEmployeeDto) {
    const res = await this.userService.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.EMPLOYEE] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateEmployeeDto) {
    const res = await this.userService.updateById(id, body);
    return res;
  }
}
