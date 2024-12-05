import { Body, Controller, Post } from '@nestjs/common';
import { DashboardServiceAdmin } from './dashboard.service';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { GetOverviewDto, GetRevenueDto } from './dto';

@Controller('/admin/dashboard')
export class DashboardControllerAdmin {
  constructor(private service: DashboardServiceAdmin) {}

  @Post('/get-revenue')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getRevenue(@Body() body: GetRevenueDto) {
    const res = await this.service.getRevenue(body);
    return res;
  }

  @Post('/overview')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN] })
  async getOverview(@Body() body: GetOverviewDto) {
    const res = await this.service.getOverview(body);
    return res;
  }
}
