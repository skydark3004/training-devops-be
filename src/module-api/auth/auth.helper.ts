import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_CONFIG } from 'src/configs/app.config';
import { UserEntity } from 'src/core/entity';
import { EnumTokenType } from 'src/core/enum/type.enum';
import { IPayload } from 'src/core/interfaces/payload.interface';
import { addDateWithDuration, addTimeWithDuration, getCurrentTime } from 'src/libs/utils';
import bcryptjs from 'bcryptjs';
import { LevelOfCustomerRepository, LevelRepository, LevelSexologyRepository } from 'src/module-repository/repository';

@Injectable()
export class AuthHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly levelRepository: LevelRepository,
    private readonly levelSexologyRepository: LevelSexologyRepository,
    private readonly levelOfCustomerRepository: LevelOfCustomerRepository,
  ) {}

  signToken(data: { user: UserEntity; isKeepLogin?: boolean; typeToken: EnumTokenType; expiresIn?: number }) {
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
        expiresIn = data?.expiresIn || SECONDS_IN_10_YEARS; // TODO: xóa khi FE đã làm xong
        break;
    }

    const token = this.jwtService.sign(payload, {
      secret: APP_CONFIG.ENV.SECURE.JWT.SECRET_KEY,
      expiresIn: expiresIn,
      algorithm: 'HS512',
    });
    return { token, expiresIn };
  }

  async checkPassword(passInput: string, passDB: string) {
    const isCorrect = await bcryptjs.compare(passInput, passDB);
    if (!isCorrect) throw new BadRequestException('Sai mật khẩu');

    return isCorrect;
  }
}
