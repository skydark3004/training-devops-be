import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TipServiceMobile } from './tip.service';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/mobile/tip')
export class TipControllerMobile {
  constructor(private service: TipServiceMobile) {}

  @Get('/get-all')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getAllTips() {
    const res = await this.service.getAllTips();
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getById(id);
    return res;
  }
}
