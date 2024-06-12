import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Response as ExpressResponse } from 'express';

@Injectable()
export class AddDataToHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ResponseObj: ExpressResponse = context.switchToHttp().getResponse();
    const ONE_DAY_TO_SECONDS = 86400;
    ResponseObj.setHeader('Access-Control-Max-Age', ONE_DAY_TO_SECONDS);
    ResponseObj.setHeader('Access-Control-Allow-Origin', '*');
    return next.handle();
  }
}
