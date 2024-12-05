import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { NutritionServiceMobile } from './nutrition.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
@Controller('/mobile/nutrition')
export class NutritionControllerMobile {
  constructor(private service: NutritionServiceMobile) {}

  /*   @Get('/list')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getList(@Query() query: any) {
    const res = await this.service.getList(query);
    return res;
  }
 */
  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.getById(id, userId);
    return res;
  }

  @Post('/:id/mark-as-read')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async markAsReadById(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.markAsReadById(id, currentUser.userId);
    return res;
  }
}
