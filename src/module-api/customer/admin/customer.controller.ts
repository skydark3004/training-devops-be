import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';

import { CustomerServiceAdmin } from './customer.service';

import { Auth } from 'src/decorators';
import { EnumPermission, EnumRoleCode } from 'src/core/enum';
import { ListCustomerDto, UpdateCustomerDto } from './dto';

@Controller('/admin/customer')
export class CustomerControllerAdmin {
  constructor(private userService: CustomerServiceAdmin) {}

  @Get('/list-customer')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.CUSTOMER] })
  async getListCustomer(@Query() query: ListCustomerDto) {
    const res = await this.userService.getListCustomer(query);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.userService.getById(id);
    return res;
  }

  @Get('/:id/history-subscribe')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.CUSTOMER] })
  async getHistorySubscribe(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.userService.getHistorySubscribe(id);
    return res;
  }

  @Get('/:id/learning-progress')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.CUSTOMER] })
  async getLearningProgress(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.userService.getLearningProgress(id);
    return res;
  }

  @Put('/:id')
  @Auth({ roles: [EnumRoleCode.ADMIN, EnumRoleCode.EMPLOYEE, EnumRoleCode.SUPER_ADMIN], permissions: [EnumPermission.CUSTOMER] })
  async updateById(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateCustomerDto) {
    const res = await this.userService.updateById(id, body);
    return res;
  }
}
