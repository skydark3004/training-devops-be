import { Module } from '@nestjs/common';

import { VoucherServiceAdmin } from './admin/voucher.service';
import { VoucherControllerAdmin } from './admin/voucher.controller';
import { HelperParent } from './voucher.helper-parent';
import { VoucherControllerMobile } from './mobile/voucher.controller';
import { VoucherServiceMobile } from './mobile/voucher.service';

@Module({
  imports: [],
  controllers: [VoucherControllerAdmin, VoucherControllerMobile],
  providers: [VoucherServiceAdmin, HelperParent, VoucherServiceMobile],
  exports: [VoucherServiceAdmin, VoucherServiceMobile],
})
export class VoucherModule {}
