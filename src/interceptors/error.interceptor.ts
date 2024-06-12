import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * @description
 * `Interceptor` này dùng để custom các error của nestjs\
 * ngoài ra ``send email`` tới ``onwer source`` khi có internal server
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        if (error instanceof BadRequestException) {
          // format error message ở dạng `array string` thành `string`
          const errorResponse = error.getResponse();
          if (typeof errorResponse === 'object') {
            const objError = {
              ...errorResponse,
              statusCode: 400,
              error: 'Bad Request',
              message: flatError(errorResponse['message']) || 'Bad Request',
            };
            return throwError(() => new BadRequestException(objError));
          }
          return throwError(() => new BadRequestException(errorResponse));
        }

        if (error instanceof UnauthorizedException) {
          return throwError(() => new UnauthorizedException(error));
        }

        if (error instanceof ForbiddenException) {
          return throwError(() => new ForbiddenException(error));
        }
        return throwError(() => new Error(error));
      }),
    );
  }
}

function flatError(errors: string | string[]) {
  if (Array.isArray(errors) && errors.length && typeof errors[0] === 'string') {
    return errors.join(', ');
  } else {
    return errors;
  }
}
