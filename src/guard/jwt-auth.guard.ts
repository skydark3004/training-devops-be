import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { isEmpty } from 'lodash';
import { APP_CONFIG } from '../configs/app.config';
import { EnumMetadata, EnumRoleCode } from 'src/core/enum';
import { UserRepository } from 'src/module-repository/repository';
import { IPayload } from 'src/core/interfaces/payload.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['normal-jwt', 'vietqr-jwt']) {
  constructor(
    private reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    //const request = context.switchToHttp().getRequest();
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const userWithInterface: IPayload = JSON.parse(JSON.stringify(user));
    // custom message khi token hết hạn
    if (info?.message === 'jwt expired') {
      throw new UnauthorizedException('Access token has expired!');
    }

    if (err) throw err;

    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>(EnumMetadata.ROLES, context.getHandler());
    const allowAnonymous = this.reflector.get(EnumMetadata.ALLOW_ANONYMOUS, context.getHandler());
    const allowSecret = this.reflector.get(EnumMetadata.ALLOW_SECRET, context.getHandler());
    const onlyPostman = this.reflector.get(EnumMetadata.ONLY_POSTMAN, context.getHandler());
    const permissionList = this.reflector.get(EnumMetadata.PERMISSIONS, context.getHandler());

    if (user?.type === 'VIETQR') {
      return user;
    }

    if (onlyPostman) {
      if (request.headers['only-postman'] === 'true') return user;
      else throw new ForbiddenException('You dont have permission to access this resource');
    }

    if (allowAnonymous) return user;

    // verify secret
    const secretKey = request.headers['secret-key'];
    if (allowSecret && secretKey) {
      if (isEmpty(secretKey)) throw new UnauthorizedException();
      if (secretKey !== APP_CONFIG.ENV.SECURE.SECRET_KEY) throw new ForbiddenException('You dont have permission to access this resource');
    }

    // verify userWithInterface
    if (!userWithInterface) throw new UnauthorizedException();
    if (!roles.includes(userWithInterface.roleCode)) throw new ForbiddenException('You dont have permission to access this resource');

    if (permissionList && permissionList.length && userWithInterface.roleCode === EnumRoleCode.EMPLOYEE) {
      const isIncludeAtLeastOne = userWithInterface.permissionList.some((el) => permissionList.includes(el));
      if (!isIncludeAtLeastOne) throw new ForbiddenException('You dont have permission to access this resource');
    }

    return user;
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const isVietQrRoute = request.url.includes('/vietqr');
    if (isVietQrRoute) {
      return { strategy: 'vietqr-jwt' };
    } else {
      return { strategy: 'normal-jwt' };
    }
  }
}
