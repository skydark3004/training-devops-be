import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { PracticeProcessServiceMobile } from './practice-process.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { UpdatePracticeProcessEveryDayDto } from './dto';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { StatisticDto } from './dto/statistic.dto';

@Controller('/mobile/practice-process')
export class PracticeProcessControllerMobile {
  constructor(private service: PracticeProcessServiceMobile) {}

  @Post('/update-every-day')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async updateEveryDay(@Body() body: UpdatePracticeProcessEveryDayDto, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.updateEveryDay(body, currentUser);
    return res;
  }

  @Post('/reset')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async reset(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.reset(currentUser);
    return res;
  }

  @Get('/statistic')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async statistic(@Query() query: StatisticDto, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.statistic(query, currentUser);
    return res;
  }

  @Get('/statistic-with-previous')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async statisticWithPrevious(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.statisticWithPrevious(currentUser);
    return res;
  }
}
