import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LevelSexologyOfCustomerServiceMobile } from './level-sexology-of-customer.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/mobile/level-sexology-of-customer')
export class LevelSexologyOfCustomerControllerMobile {
  constructor(private service: LevelSexologyOfCustomerServiceMobile) {}

  @Get('/:id/statistic-exercise')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getStatisticWhenStudying(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.getStatisticWhenStudying(id, userId);
    return res;
  }

  @Get('/current')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getCurrent(@CurrentUser('userId') userId: string) {
    const res = await this.service.getCurrent(userId);
    return res;
  }
}
