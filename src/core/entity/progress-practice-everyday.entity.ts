import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';

@Entity('progress_practice_every_day')
@Unique('userId_dateInTimeZoneVn_unique_progress_practice_everyday', ['userId', 'dateInTimeZoneVn'])
export class ProgressPracticeEveryDayEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'date', nullable: false })
  dateInTimeZoneVn: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isCompletedToday: boolean;

  /*   relations */

  @ManyToOne(() => UserEntity, (entity) => entity.progressPracticeEveryDays, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
