import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { CategoryServiceMobile } from './category.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListCategoryDto } from './dto';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';

@Controller('/mobile/category')
export class CategoryControllerMobile {
  constructor(private service: CategoryServiceMobile) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getList(@Query() query: ListCategoryDto) {
    const res = await this.service.getList(query);
    return res;
  }

  @Get('/get-all')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getAll(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.getAll(currentUser);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getById(id);
    return res;
  }
}
