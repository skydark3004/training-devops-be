import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePracticeProcessEveryDayDto } from './dto';
import { PracticeProcessRepository, UserRepository } from 'src/module-repository/repository';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import moment from 'moment';
import 'moment-timezone';
import { StatisticDto } from './dto/statistic.dto';
import { EnumTypeStatistic } from '../practice-process.enum';
import {
  getCurrentMonthInYear,
  getCurrentWeekDates,
  getCurrentWeekInMonth,
  getDayInWeekDescription,
  getDaysInMonth,
  getEndDateOfCurrentMonth,
  getEndOfCurrentWeek,
  getStartDateOfCurrentMonth,
  getStartOfCurrentWeek,
} from 'src/libs/utils';
import { Between } from 'typeorm';
import Decimal from 'decimal.js';

@Injectable()
export class PracticeProcessServiceMobile {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly practiceProcessRepository: PracticeProcessRepository,
  ) {}

  async updateEveryDay(body: UpdatePracticeProcessEveryDayDto, currentUser: ICurrentUser) {
    await this.userRepository.typeOrm.findOneOrFail({ where: { id: currentUser.userId } });

    const currentDateInTimeZoneVn = moment().tz('UTC').add(7, 'hours');

    await Promise.all([
      this.practiceProcessRepository.typeOrm.upsert(
        {
          stiffness: body.stiffness,
          userId: currentUser.userId,
          dateInTimeZoneVn: currentDateInTimeZoneVn.format('YYYY-MM-DD'),
          stiffnessDuration: body.stiffnessDuration,
          sexualDuration: body.sexualDuration,
          dayInWeek: currentDateInTimeZoneVn.day(),
          weekInMonth: getCurrentWeekInMonth(),
          monthInYear: getCurrentMonthInYear(),
          dayInWeekDescription: getDayInWeekDescription(currentDateInTimeZoneVn.day()),
        },
        { skipUpdateIfNoValuesChanged: true, conflictPaths: ['userId', 'dateInTimeZoneVn'] },
      ),
      this.userRepository.typeOrm.update(
        { id: currentUser.userId },
        { currentStiffnessDuration: body.stiffnessDuration, currentSexualDuration: body.sexualDuration, currentStiffness: body.stiffness },
      ),
    ]);

    const result = await this.practiceProcessRepository.findOneByParams({
      conditions: {
        userId: currentUser.userId,
        dateInTimeZoneVn: currentDateInTimeZoneVn.format('YYYY-MM-DD'),
      },
    });

    return result;
  }

  async statistic(query: StatisticDto, currentUser: ICurrentUser) {
    const user = await this.userRepository.typeOrm.findOne({ where: { id: currentUser.userId } });
    if (!user) throw new BadRequestException('Không tồn tại người dùng');

    let start;
    let end;
    switch (query.type) {
      case EnumTypeStatistic.WEEK:
        start = getStartOfCurrentWeek({ typeOfReturn: 'string', format: 'YYYY-MM-DD' });
        end = getEndOfCurrentWeek({ typeOfReturn: 'string', format: 'YYYY-MM-DD' });
        break;

      case EnumTypeStatistic.MONTH:
        start = getStartDateOfCurrentMonth({ typeOfReturn: 'string', format: 'YYYY-MM-DD' });
        end = getEndDateOfCurrentMonth({ typeOfReturn: 'string', format: 'YYYY-MM-DD' });
        break;
    }

    const data = await this.practiceProcessRepository.findAllByParams({
      conditions: {
        userId: currentUser.userId,
        dateInTimeZoneVn: Between(start, end),
      },
    });

    let listDays: any[];
    switch (query.type) {
      case EnumTypeStatistic.WEEK:
        listDays = getCurrentWeekDates({ stiffnessDuration: 0, sexualDuration: 0 });
        break;

      case EnumTypeStatistic.MONTH:
        const now = moment().tz('UTC').add('7', 'hours');
        listDays = getDaysInMonth({ month: now.month() + 1, year: now.year() }, { stiffnessDuration: 0, sexualDuration: 0 });
        break;
    }

    for (const day of listDays) {
      const dataInThatDay = data.find((el) => el.dateInTimeZoneVn === moment(day.date).tz('UTC').format('YYYY-MM-DD'));

      if (dataInThatDay) {
        day.stiffnessDuration = dataInThatDay.stiffnessDuration;
        day.sexualDuration = dataInThatDay.sexualDuration;
        day.stiffness = dataInThatDay.stiffness;
      }
    }
    return listDays;
  }

  async statisticWithPrevious(currentUser: ICurrentUser) {
    const { wishDuration } = await this.userRepository.typeOrm.findOneOrFail({ where: { id: currentUser.userId } });

    if (!wishDuration) {
      return { amountTimeIncrease: null, percentTimeIncrease: null, wishDuration: null, type: null, stiffness: null };
    }

    const [current, previous] = await this.practiceProcessRepository.typeOrm.find({
      where: { userId: currentUser.userId },
      order: { dateInTimeZoneVn: 'DESC' },
      take: 2,
    });

    if (!current || !previous) {
      return { amountTimeIncrease: null, percentTimeIncrease: null, wishDuration, type: null, stiffness: null };
    }

    const amountTimeIncrease = current.sexualDuration - previous.sexualDuration;
    let percentTimeIncrease;
    let type;
    if (amountTimeIncrease > 0) {
      type = 'INCREASE';
      percentTimeIncrease = new Decimal(current.sexualDuration).dividedBy(previous.sexualDuration).times(100).toNumber();
    } else if (amountTimeIncrease === 0) {
      percentTimeIncrease = 0;
      type = 'EQUAL';
    } else if (amountTimeIncrease < 0) {
      type = 'DECREASE';
      percentTimeIncrease = 100 - new Decimal(current.sexualDuration).dividedBy(previous.sexualDuration).times(100).toNumber();
    }

    return { amountTimeIncrease, percentTimeIncrease, wishDuration, type };
  }

  async reset(currentUser: ICurrentUser) {
    await Promise.all([
      this.practiceProcessRepository.typeOrm.delete({ userId: currentUser.userId }),

      this.userRepository.typeOrm.update(
        { id: currentUser.userId },
        { currentStiffnessDuration: null, currentSexualDuration: null, currentStiffness: null },
      ),
    ]);
    return { message: 'Thiết lập lại thành công' };
  }
}
