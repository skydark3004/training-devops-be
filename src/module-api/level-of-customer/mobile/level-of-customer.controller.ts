import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { LevelOfCustomerServiceMobile } from './level-of-customer.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { GroupByExericseWhenStudyingDto } from './dto';

@Controller('/mobile/level-of-customer')
export class LevelOfCustomerControllerMobile {
  constructor(private service: LevelOfCustomerServiceMobile) {}

  @Get('/:id/group-by-exercise-when-done')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async groupByExericseWhenDone(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.groupByExericseWhenDone(id, userId);
    return res;
  }

  @Post('/:id/current-practice-day')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getCurrentPracticeDayByLevelOfCustomerId(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
    @Body() body: GroupByExericseWhenStudyingDto,
  ) {
    const res = await this.service.getCurrentPracticeDayByLevelOfCustomerId(id, userId, body);
    return res;
  }
}
