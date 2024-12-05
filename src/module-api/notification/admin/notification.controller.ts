import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { NotificationServiceAdmin } from './notification.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListNotificationDto } from './dto';

@Controller('/admin/notification')
export class NotificationControllerAdmin {
  constructor(private service: NotificationServiceAdmin) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getList(@Query() query: ListNotificationDto) {
    const res = await this.service.getList(query);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getById(id);
    return res;
  }

  @Post('/create')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async create(@Body() body: CreateNotificationDto) {
    const res = await this.service.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateNotificationDto) {
    const res = await this.service.updateById(id, body);
    return res;
  }
}
