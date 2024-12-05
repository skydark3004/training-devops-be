import { Module } from '@nestjs/common';

import { PurchaseService } from './admin/purchase.service';
import { PurchaseController } from './admin/purchase.controller';
import { PurchaseHelper } from './admin/purchase.helper';
import { PurchaseControllerMobile } from './mobile/purchase.controller';
import { PurchaseServiceMobile } from './mobile/purchase.service';

@Module({
  imports: [],
  controllers: [PurchaseController, PurchaseControllerMobile],
  providers: [PurchaseService, PurchaseHelper, PurchaseServiceMobile],
  exports: [PurchaseService, PurchaseServiceMobile],
})
export class PurchaseModule {}
