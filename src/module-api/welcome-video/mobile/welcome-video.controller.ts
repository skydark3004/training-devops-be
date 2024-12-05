import { Controller, Get } from '@nestjs/common';
import { WelcomeVideoServiceMobile } from './welcome-video.service';

@Controller('/mobile/welcome-video')
export class WelcomeVideoControllerMobile {
  constructor(private service: WelcomeVideoServiceMobile) {}

  @Get('/current')
  async getCurrent() {
    const res = await this.service.getCurrent();
    return res;
  }
}
