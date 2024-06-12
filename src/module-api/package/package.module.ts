import { Module } from '@nestjs/common';

import { PackageService } from './admin/package.service';
import { PackageController } from './admin/package.controller';
import { PackageHelper } from './admin/package.helper';

@Module({
  imports: [],
  controllers: [PackageController],
  providers: [PackageService, PackageHelper],
  exports: [PackageService],
})
export class PackageModule {}
