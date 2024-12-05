import { Module } from '@nestjs/common';

import { NutritionServiceAdmin } from './admin/nutrition.service';
import { NutritionControllerAdmin } from './admin/nutrition.controller';
import { HelperParent } from './nutrition.helper-parent';
import { HelperAdmin } from './admin/nutrition.helper';
import { NutritionControllerMobile } from './mobile/nutrition.controller';
import { NutritionServiceMobile } from './mobile/nutrition.service';

@Module({
  imports: [],
  controllers: [NutritionControllerAdmin, NutritionControllerMobile],
  providers: [NutritionServiceAdmin, HelperParent, HelperAdmin, NutritionServiceMobile],
  exports: [NutritionServiceAdmin, NutritionServiceMobile],
})
export class NutritionModule {}
