import { Controller, Get } from '@nestjs/common';
import { ActualPracticeDayServiceMobile } from './actual-practice-day.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/mobile/actual-practice-day')
export class ActualPracticeDayControllerMobile {
  constructor(private service: ActualPracticeDayServiceMobile) {}

  @Get('/current-actual-practice-day')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getCurrentActualPracticeDay(@CurrentUser('userId') userId: string) {
    const res = await this.service.getCurrentActualPracticeDay(userId);
    return res;
  }

  @Get('/current-actual-practice-day-v2')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getCurrentActualPracticeDayVer2(@CurrentUser('userId') userId: string) {
    const res = await this.service.getCurrentActualPracticeDayVer2(userId);
    return res;
  }
}
