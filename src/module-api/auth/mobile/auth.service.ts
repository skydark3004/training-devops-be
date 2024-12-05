import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumResponseError } from '../auth.enum';
import { compareBetweenTwoDates, comparePassword, getCurrentTime, hashPassword, StringUtil } from 'src/libs/utils';
import 'moment-timezone';
import { UserRepository } from 'src/module-repository/repository';
import { EnumTokenType, EnumTypeRegisterUser } from 'src/core/enum/type.enum';
import { EnumRoleCode } from 'src/core/enum';
import moment from 'moment';
import { AuthHelper } from '../auth.helper';
import { ChangePasswordByTokenDto, ForgotPasswordDto, LoginDto, RegisterUserDto, VerifyOtpDto } from './dto';
import { UserEntity } from 'src/core/entity';

@Injectable()
export class AuthServiceMobile {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authHelper: AuthHelper,
  ) {}

  async login(body: LoginDto) {
    const user = await this.userRepository.findOneByParams({
      conditions: { phoneNumber: body.phoneNumber },
      select: this.userRepository.getSelectColumns({
        columns: ['id', 'status', 'fullName', 'username', 'phoneNumber', 'roleCode', 'password'],
        type: 'SELECT',
      }),
    });
    if (!user) throw new BadRequestException('Không tồn tại tài khoản');
    if (!user.status) throw new BadRequestException('Tài khoản đang tạm dừng hoạt động. Không thể đăng nhập');

    if (!user.password) {
      throw new BadRequestException('Tài khoản đang tạm dừng hoạt động. Không thể đăng nhập');
    }

    const isCorrectPassword = await comparePassword(body.password, user.password);
    if (!isCorrectPassword) {
      throw new BadRequestException(EnumResponseError.PASSWORD_IS_WRONG);
    }

    const refreshToken = this.authHelper.signToken({ user, isKeepLogin: true, typeToken: EnumTokenType.REFRESH_TOKEN });
    const accessToken = this.authHelper.signToken({ user, typeToken: EnumTokenType.ACCESS_TOKEN });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      ...rest,
      refreshToken: refreshToken.token,
      accessToken: accessToken.token,
      expiresOfAcessToken: accessToken.expiresIn,
    };
  }

  async genToken(body: any) {
    const user = await this.userRepository.findOneByParams({
      conditions: { id: body.id },
      select: this.userRepository.getSelectColumns({
        columns: ['id', 'status', 'fullName', 'username', 'phoneNumber', 'roleCode', 'password'],
        type: 'SELECT',
      }),
    });
    if (!user) throw new BadRequestException('Không tồn tại tài khoản');
    if (!user.status) throw new BadRequestException('Tài khoản đang tạm dừng hoạt động. Không thể đăng nhập');

    if (!user.password) {
      throw new BadRequestException('Tài khoản đang tạm dừng hoạt động. Không thể đăng nhập');
    }

    const refreshToken = this.authHelper.signToken({ user, isKeepLogin: true, typeToken: EnumTokenType.REFRESH_TOKEN });
    const accessToken = this.authHelper.signToken({ user, typeToken: EnumTokenType.ACCESS_TOKEN });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      ...rest,
      refreshToken: refreshToken.token,
      accessToken: accessToken.token,
      expiresOfAcessToken: accessToken.expiresIn,
    };
  }

  async register(body: RegisterUserDto) {
    const user = await this.handleWhenRegister(body);

    if (body.type === EnumTypeRegisterUser.ANONYMOUS) {
      const SECONDS_IN_100_YEARS = 3153600000;
      const { token, expiresIn } = this.authHelper.signToken({
        user,
        typeToken: EnumTokenType.ACCESS_TOKEN,
        expiresIn: SECONDS_IN_100_YEARS,
      });
      return { token, expiresIn };
    }

    return { message: 'Đăng ký và gửi OTP thành công' };
  }

  async verifyOtp(body: VerifyOtpDto) {
    const userByPhoneNumber = await this.userRepository.findOneByParams({ conditions: { phoneNumber: body.phoneNumber } });
    if (!userByPhoneNumber) throw new BadRequestException('Không tồn tại số điện thoại');

    if (body.otp !== userByPhoneNumber.otpCode) throw new BadRequestException('Mã OTP không đúng');

    const now = getCurrentTime();
    if (compareBetweenTwoDates(now, '>', userByPhoneNumber.otpExpiresAt)) {
      throw new BadRequestException('Mã OTP đã hết hạn. Vui lòng gửi lại mã OTP mới');
    }

    const token = StringUtil.genRandomString(30);
    const tokenExpiresAt = moment().add(30, 'minute').toDate();

    await this.userRepository.typeOrm.update(
      { id: userByPhoneNumber.id },
      {
        otpCode: null,
        otpExpiresAt: null,
        tokenForChangePassword: token,
        tokenExpiresAt: tokenExpiresAt,
      },
    );

    return { token };
  }

  async changePasswordByToken(body: ChangePasswordByTokenDto) {
    const userByToken = await this.userRepository.findOneByParams({ conditions: { tokenForChangePassword: body.token } });
    if (!userByToken) throw new BadRequestException('Không tồn tại người dùng');

    const hashPass = await hashPassword(body.password);

    await this.userRepository.typeOrm.update(
      { id: userByToken.id },
      {
        password: hashPass,
        tokenForChangePassword: null,
        tokenExpiresAt: null,
      },
    );
    const refreshToken = this.authHelper.signToken({ user: userByToken, isKeepLogin: true, typeToken: EnumTokenType.REFRESH_TOKEN });
    const accessToken = this.authHelper.signToken({ user: userByToken, typeToken: EnumTokenType.ACCESS_TOKEN });

    return { accessToken, refreshToken };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const userByPhoneNumber = await this.userRepository.findOneByParams({ conditions: { phoneNumber: body.phoneNumber } });
    if (!userByPhoneNumber) throw new BadRequestException('Không tồn tại số điện thoại');

    const OTP_DEFAULT = '9999';

    await this.userRepository.typeOrm.update(
      { id: userByPhoneNumber.id },
      { otpCode: OTP_DEFAULT, otpExpiresAt: moment().add(30, 'minute').toDate() },
    );

    return { message: 'Gửi OTP thành công' };
  }

  private async handleWhenRegister(body: RegisterUserDto): Promise<UserEntity> {
    const OTP_DEFAULT = '9999';

    // trường hợp loại đăng ký vs OTP và có gửi kèm anonymous ID
    // => đây là trường hợp sync data
    // check xem sdt cần sync đã có người sử dụng chưa?
    if (body.type === EnumTypeRegisterUser.OTP && body.anonymousId) {
      const userWithAnonymousId = await this.userRepository.findOneByParams({ conditions: { anonymousId: body.anonymousId } });
      if (userWithAnonymousId) {
        const isExist = await this.userRepository.findOneByParams({ conditions: { phoneNumber: body.phoneNumber } });
        if (isExist) {
          throw new BadRequestException('Số điện thoại đã được sử dụng');
        }

        await this.userRepository.typeOrm.update(
          { id: userWithAnonymousId.id },
          {
            fullName: body.fullName,
            phoneNumber: body.phoneNumber,
            otpCode: OTP_DEFAULT,
            otpExpiresAt: moment().add(30, 'minute').toDate(),
            status: true,
          },
        );
        return userWithAnonymousId;
      }
    }

    const paramToCreate: any = {
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      roleCode: EnumRoleCode.CUSTOMER,
      status: true,
    };

    switch (body.type) {
      case EnumTypeRegisterUser.ANONYMOUS:
        const getByAnonyId = await this.userRepository.findOneByParams({ conditions: { anonymousId: body.anonymousId } });
        if (getByAnonyId) throw new BadRequestException(`${EnumResponseError.USER_EXIST} với id ${body.anonymousId}`);
        paramToCreate.anonymousId = body.anonymousId;

        break;

      case EnumTypeRegisterUser.OTP:
        const isExist = await this.userRepository.findOneByParams({ conditions: { phoneNumber: body.phoneNumber } });
        if (isExist) {
          throw new BadRequestException('Số điện thoại đã được sử dụng');
        }

        paramToCreate.otpCode = OTP_DEFAULT;
        paramToCreate.otpExpiresAt = moment().add(30, 'minute').toDate();
        break;
    }

    const randomPassword = StringUtil.genRandomString(30);
    const hashPass = await hashPassword(randomPassword);
    paramToCreate.password = hashPass;

    const createUser = await this.userRepository.typeOrm.save(paramToCreate, { transaction: false });
    return createUser;
  }
}
