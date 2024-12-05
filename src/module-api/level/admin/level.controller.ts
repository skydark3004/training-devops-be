import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { LevelServiceAdmin } from './level.service';
import { CreateLevelDto, ListLevelDto, UpdateLevelDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/admin/level')
export class LevelControllerAdmin {
  constructor(private service: LevelServiceAdmin) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getList(@Query() query: ListLevelDto) {
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
  async create(@Body() body: CreateLevelDto) {
    const res = await this.service.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateLevelDto) {
    const res = await this.service.updateById(id, body);
    return res;
  }
}
