import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { APP_CONFIG } from '../configs/app.config';
import { UserRepository } from 'src/module-repository/repository';
import { IPayload } from 'src/core/interfaces/payload.interface';
import { EnumRoleCode } from 'src/core/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'normal-jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: APP_CONFIG.ENV.SECURE.JWT.SECRET_KEY,
    });
  }

  async validate(payload: IPayload) {
    if (!payload.roleCode) {
      throw new UnauthorizedException();
    }

    if (payload.roleCode === EnumRoleCode.EMPLOYEE) {
      const findUser = await this.userRepository.findById(payload.userId, { relations: { permission: true } });
      if (!findUser) throw new UnauthorizedException('User not found');
      payload.permissionList = findUser?.permission?.details;
    }

    return payload;
  }
}
