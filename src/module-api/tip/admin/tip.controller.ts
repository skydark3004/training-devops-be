import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { TipServiceAdmin } from './tip.service';
import { CreateTipDto, UpdateTipDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListTipDto } from './dto';

@Controller('/admin/tip')
export class TipControllerAdmin {
  constructor(private service: TipServiceAdmin) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getList(@Query() query: ListTipDto) {
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
  async create(@Body() body: CreateTipDto) {
    const res = await this.service.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateTipDto) {
    const res = await this.service.updateById(id, body);
    return res;
  }
}
