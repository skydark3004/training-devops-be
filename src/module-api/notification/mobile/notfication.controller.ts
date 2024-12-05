import { Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { NotificationServiceMobile } from './notification.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { GetAllNotificationDto, ListNotificationDto } from './dto';

@Controller('/mobile/notification')
export class NotificationControllerMobile {
  constructor(private service: NotificationServiceMobile) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getList(@Query() query: ListNotificationDto) {
    const res = await this.service.getList(query);
    return res;
  }

  @Get('/get-all')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getAll(@Query() query: GetAllNotificationDto, @CurrentUser('userId') userId: string) {
    const res = await this.service.getAll(query, userId);
    return res;
  }

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getById(id);
    return res;
  }

  @Post('/:id/like')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async likeNotificationById(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.likeNotificationById(id, userId);
    return res;
  }
}
