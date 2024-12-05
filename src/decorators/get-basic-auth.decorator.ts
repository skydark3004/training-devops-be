import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetBasicAuth = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authorizationHeader = request.headers['authorization'];

  // Lấy mã Base64 từ Authorization header
  const base64Credentials = authorizationHeader.split(' ')[1];

  return base64Credentials;
});
