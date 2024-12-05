import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { LevelSexologyServiceMobile } from './level-sexology.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/mobile/level-sexology')
export class LevelSexologyControllerMobile {
  constructor(private service: LevelSexologyServiceMobile) {}

  @Get('/get-list-group-by-module')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getListGroupByModule(@CurrentUser('userId') userId: string) {
    const res = await this.service.getListGroupByModule(userId);
    return res;
  }

  @Get('/:id/get-preview')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getPreviewById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getPreviewById(id);
    return res;
  }

  @Post('/:id/start-learning')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async startLearning(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.startLearning(id, userId);
    return res;
  }
}
