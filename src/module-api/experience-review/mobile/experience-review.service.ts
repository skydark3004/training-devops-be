import { Injectable } from '@nestjs/common';
import { ExperienceReviewRepository } from 'src/module-repository/repository';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { CreateExperienceReviewDto } from './dto';

@Injectable()
export class ExperienceReviewServiceMobile {
  constructor(private readonly experienceReviewRepository: ExperienceReviewRepository) {}

  async createExperienceReview(body: CreateExperienceReviewDto, currentUser: ICurrentUser) {
    const result = await this.experienceReviewRepository.typeOrm.save(
      { userId: currentUser.userId, star: body.star, content: body.content },
      { transaction: false },
    );

    return result;
  }
}
