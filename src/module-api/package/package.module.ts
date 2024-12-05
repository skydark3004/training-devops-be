import { Module } from '@nestjs/common';

import { PackageService } from './admin/package.service';
import { PackageController } from './admin/package.controller';
import { PackageHelper } from './admin/package.helper';
import { PackageControllerMobile } from './mobile/package.controller';
import { PackageServiceMobile } from './mobile/package.service';

@Module({
  imports: [],
  controllers: [PackageController, PackageControllerMobile],
  providers: [PackageService, PackageHelper, PackageServiceMobile],
  exports: [PackageService, PackageServiceMobile],
})
export class PackageModule {}
