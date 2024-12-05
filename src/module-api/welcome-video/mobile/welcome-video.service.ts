import { Injectable } from '@nestjs/common';
import { HelperParent } from '../welcome-video.helper-parent';

@Injectable()
export class WelcomeVideoServiceMobile {
  constructor(private helperParent: HelperParent) {}

  async getCurrent() {
    const result = await this.helperParent.getCurrent();
    return result;
  }
}
