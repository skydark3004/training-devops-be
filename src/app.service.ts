import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { msg: `Hello world test 17/02 ! ${process.env.NODE_ENV}` };
  }
}
