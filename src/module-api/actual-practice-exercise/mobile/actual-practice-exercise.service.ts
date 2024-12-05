import { convertFullPathToPreview } from 'src/common';
import { BadRequestException, Injectable } from '@nestjs/common';

import {
  ActualPracticeDayMapExerciseRepository,
  ActualPracticeDayRepository,
  ExerciseRepository,
  ExperienceReviewRepository,
  ProgressPracticeEveryDayRepository,
  UserRepository,
} from 'src/module-repository/repository';
import { CompleteExerciseDto } from './dto';
import moment from 'moment';
import { Message } from 'firebase-admin/messaging';

@Injectable()
export class ActualPracticeExerciseServiceMobile {
  constructor(
    private readonly actualPracticeDayMapExerciseRepository: ActualPracticeDayMapExerciseRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly userRepository: UserRepository,
    private readonly actualPracticeDayRepository: ActualPracticeDayRepository,
    private readonly experienceReviewRepository: ExperienceReviewRepository,
    private readonly progressPracticeEveryDayRepository: ProgressPracticeEveryDayRepository,
  ) {}

  async getPreviewById(id: string, userId: string) {
    const columnToSelectFromQuery = this.actualPracticeDayMapExerciseRepository.getSelectColumns({
      columns: ['id', 'description', 'exerciseCloneData', 'frequency', 'currentPracticeTimes', 'isCompleted', 'actualPracticeDay'],
      type: 'SELECT',
    });

    const actualPraticeExercise = await this.actualPracticeDayMapExerciseRepository.findOneByParams({
      conditions: { id, userId },
      relations: { actualPracticeDay: { levelOfCustomer: true }, exercise: true },
      select: {
        ...columnToSelectFromQuery,
        exercise: {
          id: true,
          name: true,
          thumbnail: true,
        },
      },
    });
    if (!actualPraticeExercise) throw new BadRequestException('Không tìm thấy bài tập');

    actualPraticeExercise.exercise.thumbnailToPreview = convertFullPathToPreview(actualPraticeExercise.exercise.thumbnail);

    actualPraticeExercise.exerciseCloneData = this.exerciseRepository.convertUrlToPreview(actualPraticeExercise.exerciseCloneData, {
      //thumbnail: true,
      guideVideos: true,
      details: true,
    }) as any;

    actualPraticeExercise.actualPracticeDay = {
      currentLevel: actualPraticeExercise.actualPracticeDay.levelOfCustomer.index,
      currentDayToStudy: actualPraticeExercise.actualPracticeDay.index,
      totalDaysToStudy: actualPraticeExercise.actualPracticeDay.levelOfCustomer.totalDaysToStudy,
    } as any;

    return actualPraticeExercise;
  }

  async getDetailById(id: string) {
    const getById: any = await this.actualPracticeDayMapExerciseRepository.findById(id, {});
    if (!getById) throw new BadRequestException('Không tìm thấy bài tập');

    getById.exerciseCloneData = this.exerciseRepository.convertUrlToPreview(getById.exerciseCloneData, {
      thumbnail: true,
      guideVideos: true,
      details: true,
    });

    return getById;
  }

  async completeById(id: string, body: CompleteExerciseDto, userId: string) {
    const actualPraticeExercise = await this.actualPracticeDayMapExerciseRepository.findOneByParams({
      conditions: { id, userId },
    });
    if (!actualPraticeExercise) throw new BadRequestException('Không tìm thấy bài tập');

    if (actualPraticeExercise.isCompleted) {
      return await this.getDetailById(id);
    }

    const paramsToUpdate: any = {
      currentPracticeTimes: actualPraticeExercise.currentPracticeTimes + 1,
    };
    if (actualPraticeExercise.currentPracticeTimes + 1 === actualPraticeExercise.frequency) {
      paramsToUpdate.isCompleted = true;
    }
    await this.actualPracticeDayMapExerciseRepository.typeOrm.update({ id }, paramsToUpdate);
    const result = await this.getDetailById(id);

    await Promise.all([
      this.experienceReviewRepository.typeOrm.save(
        { userId: userId, star: body.star, content: body.content, exerciseId: actualPraticeExercise.exerciseCloneData.id },
        { transaction: false },
      ),
      this.progressPracticeEveryDayRepository.typeOrm.upsert(
        { userId, dateInTimeZoneVn: moment().tz('UTC').add(7, 'hours').format('YYYY-MM-DD') },
        { skipUpdateIfNoValuesChanged: true, conflictPaths: ['userId', 'dateInTimeZoneVn'] },
      ),
    ]);

    this.updateStreak(userId);

    //update hoạt động luyện tập hôm nay để xử lí bắn notify
    this.updatePracticeProgress(actualPraticeExercise.actualPracticeDayId);

    return result;
  }

  private async updateStreak(userId: string) {
    const yesterday = moment().tz('UTc').add(7, 'hours').subtract(1, 'days').format('YYYY-MM-DD');
    const previous = await this.progressPracticeEveryDayRepository.findOneByParams({ conditions: { dateInTimeZoneVn: yesterday } });
    if (previous) {
      await this.userRepository.typeOrm
        .createQueryBuilder()
        .update()
        .set({ streaks: () => 'streaks + 1' })
        .where('id = :userId', { userId })
        .execute();
    } else {
      await this.userRepository.typeOrm.update({ id: userId }, { streaks: 1 });
    }
  }

  private async updatePracticeProgress(actualPracticeDayId: string) {
    const getById = await this.actualPracticeDayRepository.findById(actualPracticeDayId, {
      relations: { exercisesInThatDay: true, user: true },
    });

    const isExistNotCompleted = getById.exercisesInThatDay.find((el) => !el.isCompleted);
    if (!isExistNotCompleted) {
      await this.progressPracticeEveryDayRepository.typeOrm.update(
        {
          userId: getById.userId,
          dateInTimeZoneVn: moment().tz('UTC').add(7, 'hours').format('YYYY-MM-DD'),
        },
        { isCompletedToday: true },
      );

      // notify khi hoàn thành
      const messages: Message[] = getById.user.fcmToken.map((token) => {
        return {
          token,
          notification: {
            title: 'Thông Báo Thành Tựu',
            body: `Tuyệt vời. ${getById?.user?.fullName || 'Bạn'} đã hoàn thành kế hoạch hôm nay rồi. Nhớ duy trì để khoẻ mạnh hơn nha `,
          },
        };
      });
    }
  }
}
