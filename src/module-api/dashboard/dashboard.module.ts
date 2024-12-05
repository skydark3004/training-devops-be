import { Module } from '@nestjs/common';
import { DashboardServiceAdmin } from './admin/dashboard.service';
import { DashboardControllerAdmin } from './admin/dashboard.controller';
import { HelperParent } from './dashboard.helper-parent';

@Module({
  imports: [],
  controllers: [DashboardControllerAdmin],
  providers: [DashboardServiceAdmin, HelperParent],
  exports: [DashboardServiceAdmin],
})
export class DashboardModule {}
