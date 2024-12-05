import { Body, Controller, Get, Post } from '@nestjs/common';

import { ConfigServiceAdmin } from './config.service';
import { UpdateGoogleSheetDto } from './dto';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/admin/config')
export class ConfigControllerAdmin {
  constructor(private service: ConfigServiceAdmin) {}

  @Get('get-config-google-sheet')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getConfigGoogleSheet() {
    const res = await this.service.getConfigGoogleSheet();
    return res;
  }

  @Post('/update-google-sheet')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async updateGoogleSheet(@Body() body: UpdateGoogleSheetDto) {
    const res = await this.service.updateGoogleSheet(body);
    return res;
  }
}
