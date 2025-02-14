import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { msg: `Hello world test ! ${process.env.NODE_ENV}` };
  }
}
