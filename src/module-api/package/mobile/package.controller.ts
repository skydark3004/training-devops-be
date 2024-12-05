import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { PackageServiceMobile } from './package.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ListPackageDto, PreviewOrderDto, PurchasePackageByBankDto, SubscribeByPackageIdDto } from './dto';

@Controller('/mobile/package')
export class PackageControllerMobile {
  constructor(private service: PackageServiceMobile) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getList(@Query() query: ListPackageDto) {
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

  @Post('/:id/subscribe')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async subscribeByPackageId(@Param('id', ParseUUIDPipe) id: string, @Body() body: SubscribeByPackageIdDto, @CurrentUser('userId') userId: string) {
    const res = await this.service.subscribeByPackageId(id, body, userId);
    return res;
  }

  @Post('/:id/preview-order')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async previewOrder(@Param('id', ParseUUIDPipe) id: string, @Body() body: PreviewOrderDto, @CurrentUser('userId') userId: string) {
    const res = await this.service.previewOrderWhenPurchaseByBank(id, body, userId);
    return res;
  }
}
