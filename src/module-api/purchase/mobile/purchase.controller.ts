import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PurchaseServiceMobile } from './purchase.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/mobile/purchase')
export class PurchaseControllerMobile {
  constructor(private service: PurchaseServiceMobile) {}

  @Post('/:id/confirm-transfered')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async confirmTransfered(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.confirmTransfered(id, userId);
    return res;
  }
}
