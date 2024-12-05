import { Injectable } from '@nestjs/common';

import { WelcomeVideoRepository } from 'src/module-repository/repository';

@Injectable()
export class HelperParent {
  constructor(private readonly welcomeVideoRepository: WelcomeVideoRepository) {}

  async getCurrent() {
    const getById = await this.welcomeVideoRepository.findOneByParams({ conditions: { code: 'DEFAULT' } });
    if (!getById) {
      return {
        sexologyToPreview: null,
        firstToPreview: null,
        secondToPreview: null,
        thirdToPreview: null,
        first: null,
        second: null,
        third: null,
        sexology: null,
      };
    }

    return this.welcomeVideoRepository.convertUrlToPreview(getById);
  }
}
