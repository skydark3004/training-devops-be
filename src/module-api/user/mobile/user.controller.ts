import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UserServiceMobile } from './user.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { ChangePasswordDto, UpdateMyProfileDto } from './dto';

@Controller('/mobile/user')
export class UserControllerMobile {
  constructor(private userService: UserServiceMobile) {}

  @Get('/me')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getMe(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.getMe(currentUser.userId);
    return res;
  }

  @Get('/overview')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getOverview(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.getOverview(currentUser.userId);
    return res;
  }

  @Get('health-record')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getHealthRecord(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.getHealthRecord(currentUser.userId);
    return res;
  }

  @Get('statistic-level')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getStatisticLevel(@CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.getStatisticLevel(currentUser.userId);
    return res;
  }

  @Put('/update-my-profile')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async updateMyProfile(@Body() body: UpdateMyProfileDto, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.updateMyProfile(body, currentUser);
    return res;
  }

  @Post('/change-password')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async changeMyPassword(@Body() body: ChangePasswordDto, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.userService.changeMyPassword(body, currentUser);
    return res;
  }
}
