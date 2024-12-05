import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_CONFIG } from 'src/configs/app.config';
import { EnumActionSendEmail } from 'src/core/enum';
import { EmailService } from 'src/module-global/email/email.service';

/**
 * @description
 * `Interceptor` này dùng để custom các error của nestjs\
 * ngoài ra ``send email`` tới ``onwer source`` khi có internal server
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly emailService: EmailService) {}

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

        if (error.message.includes('Could not find any entity')) {
          return throwError(() => new NotFoundException('Not found'));
        }

        // internal server
        const { method, url, body, headers, query, params } = context.switchToHttp().getRequest();
        const formatError = {
          error: error.message,
          stack: error.stack,
          url: url,
          body: body,
          query,
          params,
          method: method,
          token: headers?.authorization?.split('Bearer')[1]?.trim(),
          enviroment: APP_CONFIG.ENV.NODE_ENV,
        };
        if (!APP_CONFIG.IS_LOCAL) {
          this.emailService.sendMail({
            mailTo: APP_CONFIG.ENV.OWNER_EMAIL,
            subject: 'Lỗi Internal Server',
            contentMail: {
              ERROR: JSON.stringify(formatError),
            },
            action: EnumActionSendEmail.INTERAL_SERVER,
          });
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
