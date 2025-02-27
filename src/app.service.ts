import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { msg: `Hello world ! ${process.env.NODE_ENV}` };
  }
}
