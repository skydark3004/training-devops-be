import { Module } from '@nestjs/common';

import { HelperParent } from './experience-review.helper-parent';
import { ExperienceReviewServiceMobile } from './mobile/experience-review.service';
import { ExperienceReviewControllerMobile } from './mobile/experience-review.controller';

@Module({
  imports: [],
  controllers: [ExperienceReviewControllerMobile],
  providers: [HelperParent, ExperienceReviewServiceMobile],
  exports: [ExperienceReviewServiceMobile],
})
export class ExperienceReviewModule {}
