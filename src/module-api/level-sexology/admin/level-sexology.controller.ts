import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { LevelSexologyServiceAdmin } from './level-sexology.service';
import { CreateLevelSexologyDto, UpdateLevelSexologyDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListLevelSexologyDto } from './dto';

@Controller('/admin/level-sexology')
export class LevelSexologyControllerAdmin {
  constructor(private service: LevelSexologyServiceAdmin) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getList(@Query() query: ListLevelSexologyDto) {
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
  async create(@Body() body: CreateLevelSexologyDto) {
    const res = await this.service.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateLevelSexologyDto) {
    const res = await this.service.updateById(id, body);
    return res;
  }
}
