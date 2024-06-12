import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { PermissionService } from './permission.service';
import { CreatePermissionDto, ListPermissionDto, UpdatePermissionDto } from './permission.dto';
import { Auth } from 'src/decorators';
import { RoleCodeEnum } from 'src/core/enum';

@Controller('/admin/permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('/list')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN] })
  async getList(@Query() query: ListPermissionDto) {
    const res = await this.permissionService.getList(query);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.permissionService.getById(id);
    return res;
  }

  @Post('/create')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN] })
  async create(@Body() body: CreatePermissionDto) {
    const res = await this.permissionService.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [RoleCodeEnum.ADMIN, RoleCodeEnum.EMPLOYEE, RoleCodeEnum.SUPER_ADMIN] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdatePermissionDto) {
    const res = await this.permissionService.updateById(id, body);
    return res;
  }
}
