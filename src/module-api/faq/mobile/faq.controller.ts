import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { FaqServiceMobile } from './faq.service';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListFaqDto } from './dto';

@Controller('/mobile/faq')
export class FaqControllerMobile {
  constructor(private service: FaqServiceMobile) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getList(@Query() query: ListFaqDto) {
    const res = await this.service.getList(query);
    return res;
  }

  @Get('/get-all')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getAll() {
    const res = await this.service.getAll();
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getById(id);
    return res;
  }
}
