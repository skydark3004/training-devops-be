import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { VoucherServiceMobile } from './voucher.service';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { CheckIsValidDto } from './dto/check-is-valid.dto';

@Controller('/mobile/voucher')
export class VoucherControllerMobile {
  constructor(private service: VoucherServiceMobile) {}

  @Post('/check-is-valid')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async checkIsValidById(@Body() body: CheckIsValidDto) {
    const res = await this.service.checkIsValidById(body);
    return res;
  }
}
