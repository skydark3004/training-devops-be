import { Body, Controller, Post } from '@nestjs/common';
import { ExperienceReviewServiceMobile } from './experience-review.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { CreateExperienceReviewDto } from './dto';

@Controller('/mobile/experience-review')
export class ExperienceReviewControllerMobile {
  constructor(private service: ExperienceReviewServiceMobile) {}

  @Post('/')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async createExperienceReview(@Body() body: CreateExperienceReviewDto, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.createExperienceReview(body, currentUser);
    return res;
  }
}
