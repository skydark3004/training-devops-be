import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { EnumResponseError } from './user.enum';
import {
  LevelOfCustomerRepository,
  LevelRepository,
  LevelSexologyOfCustomerRepository,
  LevelSexologyRepository,
  PurchaseRepository,
  PracticeProcessRepository,
  UserRepository,
} from 'src/module-repository/repository';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { ChangePasswordDto, UpdateMyProfileDto } from './dto';
import { IsNull, Not } from 'typeorm';
import { UserHelper } from '../user.helper';
import moment from 'moment';
import { IGetHealthRecord } from './user.interface';
import { convertFullPathToPreview } from 'src/common';
import bcryptjs from 'bcryptjs';
import { hashPassword } from 'src/libs/utils';
import { PracticeProcessEntity, UserEntity } from 'src/core/entity';

@Injectable()
export class UserServiceMobile {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly practiceProcessRepository: PracticeProcessRepository,
    private readonly levelOfCustomerRepository: LevelOfCustomerRepository,
    private readonly levelRepository: LevelRepository,
    private readonly levelSexologyRepository: LevelSexologyRepository,
    private readonly levelSexologyOfCustomerRepository: LevelSexologyOfCustomerRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly helper: UserHelper,
  ) {}

  async getMe(userId: string) {
    const getById: any = await this.userRepository.findById(userId);
    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const isVip = await this.purchaseRepository.findOneByParams({ conditions: { isUseNow: true, userId } });
    getById.isVip = isVip ? true : false;

    return getById;
  }

  async updateMyProfile(body: UpdateMyProfileDto, currentUser: ICurrentUser) {
    const getById = await this.userRepository.typeOrm.findOneBy({ id: currentUser.userId });
    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const updateParams: any = _.pick(body, 'age', 'stiffness', 'sexualDuration', 'wishDuration');

    await this.userRepository.typeOrm.update({ id: currentUser.userId }, updateParams);
    const result = await this.userRepository.findById(currentUser.userId);

    return result;
  }

  async getOverview(userId: string) {
    const getById = await this.userRepository.findById(userId);
    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const stiffnessDuration = await this.practiceProcessRepository.findOneByParams({
      conditions: { stiffnessDuration: Not(IsNull()), userId },
      order: { dateInTimeZoneVn: 'ASC' },
    });

    const firstStiffness = await this.practiceProcessRepository.findOneByParams({
      conditions: { stiffness: Not(IsNull()), userId },
      order: { dateInTimeZoneVn: 'ASC' },
    });

    const firstSexualDuration = await this.practiceProcessRepository.findOneByParams({
      conditions: { sexualDuration: Not(IsNull()), userId },
      order: { dateInTimeZoneVn: 'ASC' },
    });

    return {
      current: {
        stiffnessDuration: getById.currentStiffnessDuration || 0,
        sexualDuration: getById.currentSexualDuration || 0,
        stiffness: getById.currentStiffness || 0,
      },
      statistic: {
        increaseStiffness: this.helper.calculateIncrease(firstStiffness?.stiffness, getById.currentStiffness),
        increaseStiffnessDuration: this.helper.calculateIncrease(stiffnessDuration?.stiffnessDuration, getById.currentStiffnessDuration),
        wishDuration: getById.wishDuration || 0,
        percentOfSexualDuration: this.helper.calculatePercent(firstSexualDuration?.sexualDuration, getById.wishDuration),
      },
    };
  }

  async getHealthRecord(userId: string) {
    const [getById, firstSexualDuration, dataHealthRecord, statisticStiffness]: [UserEntity, any, IGetHealthRecord, PracticeProcessEntity[]] =
      await Promise.all([
        this.userRepository.findById(userId),

        this.practiceProcessRepository.findOneByParams({
          conditions: { sexualDuration: Not(IsNull()), userId },
          order: { dateInTimeZoneVn: 'ASC' },
        }),

        this.practiceProcessRepository.typeOrm
          .createQueryBuilder('practiceProcess')
          .where('practiceProcess.userId = :userId', { userId })
          .groupBy('practiceProcess.userId')
          .select([
            'practiceProcess.userId as "userId"',
            //'MAX(practiceProcess.dateInTimeZoneVn) as "currentDate"',
            'MIN(practiceProcess.dateInTimeZoneVn) as "startDate"',
            'COUNT(*) as total',
          ])
          .getRawOne(),

        this.practiceProcessRepository.typeOrm
          .createQueryBuilder('practiceProcess')
          .select(['practiceProcess.stiffness', 'practiceProcess.dateInTimeZoneVn'])
          .where('practiceProcess.userId = :userId', { userId })
          .orderBy('practiceProcess.dateInTimeZoneVn')
          .getMany(),
      ]);

    if (!getById) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const result = {
      startDate: dataHealthRecord?.startDate ? moment(dataHealthRecord?.startDate).tz('UTC').add(7, 'hour').format('DD-MM-YYYY') : null,
      //currentDate: currentDate ? moment(currentDate).tz('UTC').add(7, 'hour').format('DD-MM-YYYY') : null,
      currentDate: moment().tz('UTC').add(7, 'hour').format('DD-MM-YYYY'),
      total: dataHealthRecord?.total ? Number(dataHealthRecord?.total) : 0,
      wishDuration: getById?.wishDuration || null,
      firstSexualDuration: firstSexualDuration?.sexualDuration || null,
      currentDuration: getById?.currentSexualDuration || null,
      statisticListStiffness: statisticStiffness,
    };

    return result;
  }

  async getStatisticLevel(userId: string) {
    const [totalDoneLevelPc, totalLevelPc, currentLevelPc, totalDoneLevelSexology, totalLevelSexology, currentLevelSexology] = await Promise.all([
      this.levelOfCustomerRepository.typeOrm.count({ where: { userId, isCompleted: true } }),
      this.levelRepository.typeOrm.count({ where: { status: true } }),
      this.levelRepository.typeOrm
        .createQueryBuilder('level')
        .innerJoinAndMapOne(
          'level.levelOfCustomer', // tên field sau khi map sẽ trả ra khi return json
          'level_of_customer', // tên table
          'level_of_customer', // alias
          'level_of_customer.userId = :userId AND level_of_customer.levelPcId = level.id', // conditions
          { userId: userId },
        )
        .where('level_of_customer.isCompleted = false')
        .select(['level.id', 'level.name', 'level.index', 'level.pathThumbnail'])
        .getOne(),

      // level sexology
      this.levelSexologyOfCustomerRepository.typeOrm.count({ where: { userId, isCompleted: true } }), // totalDoneLevelSexology
      this.levelSexologyRepository.typeOrm.count({ where: { status: true } }), // totalLevelSexology
      this.levelSexologyRepository.typeOrm // currentLevelSexology
        .createQueryBuilder('level')
        .innerJoinAndMapOne(
          'level.levelOfCustomer', // tên field sau khi map sẽ trả ra khi return json
          'level_sexology_of_customer', // tên table
          'level_sexology_of_customer', // alias
          'level_sexology_of_customer.userId = :userId AND level_sexology_of_customer."levelSexologyId" = level.id', // conditions
          { userId: userId },
        )
        .where('level_sexology_of_customer.isCompleted = false')
        .select(['level.id', 'level.name', 'level.index', 'level.pathThumbnail', 'level.pathThumbnailToPreview'])
        .getOne(),
    ]);

    if (currentLevelPc) {
      currentLevelPc.pathThumbnailToPreview = convertFullPathToPreview(currentLevelPc.pathThumbnail);
    }

    return {
      levelPc: {
        done: totalDoneLevelPc,
        total: totalLevelPc,
        current: currentLevelPc,
      },
      levelSexology: {
        done: totalDoneLevelSexology,
        total: totalLevelSexology,
        current: currentLevelSexology,
      },
    };
  }

  async changeMyPassword(body: ChangePasswordDto, currentUser: ICurrentUser) {
    const findDetail = await this.userRepository.findById(currentUser.userId);
    if (!findDetail) throw new BadRequestException(EnumResponseError.USER_NOT_FOUND);

    const isCorrectPassword = await bcryptjs.compare(body.oldPassword, findDetail.password);
    if (!isCorrectPassword) throw new BadRequestException('Sai mật khẩu hiện tại. Hãy thử lại.');

    const paramsUpdate = { password: await hashPassword(body.password) };

    await this.userRepository.typeOrm.update({ id: currentUser.userId }, paramsUpdate);

    return { message: 'Đổi mật khẩu thành công' };
  }

  private async checkPassword(passInput: string, passDB: string) {
    const isCorrect = await bcryptjs.compare(passInput, passDB);
    if (!isCorrect) throw new BadRequestException('Sai mật khẩu');

    return isCorrect;
  }
}
