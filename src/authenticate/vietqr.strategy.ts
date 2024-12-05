import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { APP_CONFIG } from 'src/configs/app.config';

@Injectable()
export class VietQrJwtStrategy extends PassportStrategy(Strategy, 'vietqr-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: APP_CONFIG.ENV.VIETQR.SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
