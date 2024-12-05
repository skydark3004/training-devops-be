import { BadRequestException, Injectable } from '@nestjs/common';
import bcryptjs from 'bcryptjs';

import { LoginDto } from './auth.dto';
import { EnumResponseError } from './auth.enum';
import { JwtService } from '@nestjs/jwt';
import { APP_CONFIG } from 'src/configs/app.config';
import { addDateWithDuration, addTimeWithDuration, comparePassword, getCurrentTime } from 'src/libs/utils';
import 'moment-timezone';
import { UserRepository } from 'src/module-repository/repository';
import { EnumTokenType } from 'src/core/enum/type.enum';
import { UserEntity } from 'src/core/entity/user.entity';
import { IPayload } from 'src/core/interfaces/payload.interface';

@Injectable()
export class AuthServiceAdmin {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(body: LoginDto) {
    const user = await this.userRepository.findOneByParams({
      conditions: { username: body.username },
      select: this.userRepository.getSelectColumns(),
    });
    if (!user) throw new BadRequestException('Không tồn tại tài khoản');
    if (!user.status) throw new BadRequestException('Tài khoản đang tạm dừng hoạt động. Không thể đăng nhập');

    const isCorrectPassword = await comparePassword(body.password, user.password);
    if (!isCorrectPassword) {
      throw new BadRequestException(EnumResponseError.PASSWORD_IS_WRONG);
    }

    const refreshToken = this.signToken({ user, isKeepLogin: true, typeToken: EnumTokenType.REFRESH_TOKEN });
    const accessToken = this.signToken({ user, typeToken: EnumTokenType.ACCESS_TOKEN });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      ...rest,
      refreshToken: refreshToken.token,
      accessToken: accessToken.token,
      expiresOfAcessToken: accessToken.expiresIn,
    };
  }

  /*   async refreshToken(body: RefreshTokenDto) {
    const decode: any = this.jwtService.decode(body.refreshToken);
    if (decode.type !== EnumTokenType.REFRESH_TOKEN) throw new BadRequestException('NOT REFRESH TOKEN');
    const user = await this.userRepository.findById({ id: decode.userId, populate: [{ path: 'role' }] });

    if (!user) throw new BadRequestException(EnumResponseError.NOT_EXIST_THIS_EMAIL);
    if (!user.status.isActive) throw new BadRequestException(EnumResponseError.ACCOUNT_IS_INACTIVE);

    const accessToken = this.signToken({ user, typeToken: EnumTokenType.ACCESS_TOKEN });
    return { accessToken };
  } */

  async checkPassword(passInput: string, passDB: string) {
    const isTrue = await bcryptjs.compare(passInput, passDB);
    if (!isTrue) {
      throw new BadRequestException(EnumResponseError.PASSWORD_IS_WRONG);
    }
    return isTrue;
  }

  private signToken(data: { user: UserEntity; isKeepLogin?: boolean; typeToken: EnumTokenType }) {
    let expiresIn: number;
    let payload: IPayload;
    //const SECONDS_IN_5_MINUTES = 60 * 5;
    const SECONDS_IN_10_YEARS = 315360000;
    const SECONDS_IN_ONE_DAY = 60 * 60 * 24;
    const SECONDS_IN_SEVEN_DAYS = SECONDS_IN_ONE_DAY * 7;
    const EXPIRED_AT_OF_ACCESS_TOKEN = addTimeWithDuration({
      time: getCurrentTime(),
      duration: {
        hour: APP_CONFIG.IS_LOCAL ? 87600 : 0, //  10 năm = 87,600 giờ
        minute: APP_CONFIG.IS_LOCAL ? 0 : 5, // 5 phút
      },
    });

    switch (data.typeToken) {
      case EnumTokenType.REFRESH_TOKEN:
        payload = {
          username: data.user.username,
          userId: data.user.id,
          roleCode: data.user.roleCode,
          type: EnumTokenType.REFRESH_TOKEN,
          expiredAt: addDateWithDuration({ date: getCurrentTime(), duration: { day: data.isKeepLogin ? 1 : 7 } }), // 1 or 7 days,
        };

        expiresIn = data.isKeepLogin ? SECONDS_IN_SEVEN_DAYS : SECONDS_IN_ONE_DAY;
        break;

      case EnumTokenType.ACCESS_TOKEN:
        payload = {
          username: data.user.username,
          userId: data.user.id,
          roleCode: data.user.roleCode,
          type: EnumTokenType.ACCESS_TOKEN,
          expiredAt: EXPIRED_AT_OF_ACCESS_TOKEN,
        };
        //expiresIn = APP_CONFIG.IS_LOCAL ? SECONDS_IN_10_YEARS : SECONDS_IN_5_MINUTES;
        expiresIn = SECONDS_IN_10_YEARS; // TODO: xóa khi FE đã làm xong
        break;
    }

    const token = this.jwtService.sign(payload, {
      secret: APP_CONFIG.ENV.SECURE.JWT.SECRET_KEY,
      expiresIn: expiresIn,
      algorithm: 'HS512',
    });
    return { token, expiresIn };
  }
}
