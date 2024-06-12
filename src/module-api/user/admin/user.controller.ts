import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './user.dto';
import { Auth, CurrentUser } from 'src/decorators';
import { PermissionEnum, RoleCodeEnum } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';

@Controller('/admin/user')
export class UserControllerAdmin {
  constructor(private userService: UserService) {}

  @Get('/list')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN], permissions: [PermissionEnum.CUSTOMER] })
  async getList(@Query() query: ListUserDto) {
    const res = await this.userService.getList(query);
    return res;
  }

  @Get('/me')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN], permissions: [PermissionEnum.CUSTOMER] })
  async getMe(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.getById(currentUser.userId);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN], permissions: [PermissionEnum.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.userService.getById(id);
    return res;
  }

  @Post('/create')
  //@Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN], permissions: [PermissionEnum.CUSTOMER] })
  async create(@Body() body: CreateUserDto) {
    const res = await this.userService.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN], permissions: [PermissionEnum.CUSTOMER] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateUserDto) {
    const res = await this.userService.updateById(id, body);
    return res;
  }
}
