import { Body, Controller, Get, Post } from '@nestjs/common';

import { WelcomeVideoServiceAdmin } from './welcome-video.service';
import { UpsertSexologyVideoDto, UpsertWelcomeVideoDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/admin/welcome-video')
export class WelcomeVideoControllerAdmin {
  constructor(private service: WelcomeVideoServiceAdmin) {}

  @Get('/current')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getCurrent() {
    const res = await this.service.getCurrent();
    return res;
  }

  @Post('/upsert')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async upsert(@Body() body: UpsertWelcomeVideoDto) {
    const res = await this.service.upsert(body);
    return res;
  }

  @Post('/upsert-sexology')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async upsertSexology(@Body() body: UpsertSexologyVideoDto) {
    const res = await this.service.upsertSexology(body);
    return res;
  }
}
