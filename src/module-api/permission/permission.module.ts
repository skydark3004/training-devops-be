import { Module } from '@nestjs/common';

import { PermissionService } from './admin/permission.service';
import { PermissionController } from './admin/permission.controller';
import { PermissionHelper } from './admin/permission.helper';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionHelper],
  exports: [PermissionService],
})
export class PermissionModule {}
