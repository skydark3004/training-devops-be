import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { NutritionServiceAdmin } from './nutrition.service';
import { CreateNutritionDto, UpdateNutritionDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListNutritionDto } from './dto';

@Controller('/admin/nutrition')
export class NutritionControllerAdmin {
  constructor(private service: NutritionServiceAdmin) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getList(@Query() query: ListNutritionDto) {
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
  async create(@Body() body: CreateNutritionDto) {
    const res = await this.service.create(body);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateNutritionDto) {
    const res = await this.service.updateById(id, body);
    return res;
  }
}
