import { Module } from '@nestjs/common';

import { CategoryServiceAdmin } from './admin/category.service';
import { CategoryControllerAdmin } from './admin/category.controller';
import { HelperParent } from './category.helper-parent';
import { HelperAdmin } from './admin/category.helper';
import { CategoryControllerMobile } from './mobile/category.controller';
import { CategoryServiceMobile } from './mobile/category.service';

@Module({
  imports: [],
  controllers: [CategoryControllerAdmin, CategoryControllerMobile],
  providers: [CategoryServiceAdmin, HelperParent, HelperAdmin, CategoryServiceMobile],
  exports: [CategoryServiceAdmin, CategoryServiceMobile],
})
export class CategoryModule {}
