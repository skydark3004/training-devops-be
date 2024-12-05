import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';

@Entity('practice_process')
@Unique('userId_dateInTimeZoneVn_unique', ['userId', 'dateInTimeZoneVn'])
export class PracticeProcessEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'date', nullable: false })
  dateInTimeZoneVn: string;

  @Column({ type: 'int', nullable: true, default: null })
  stiffnessDuration: number;

  @Column({ type: 'int', nullable: true, default: null })
  sexualDuration: number;

  @Column({ type: 'int', nullable: true, default: null })
  stiffness: number;

  //TODO: bỏ nullable
  @Column({ type: 'int', nullable: true })
  dayInWeek: number;

  @Column({ type: 'text', nullable: true })
  dayInWeekDescription: string;

  @Column({ type: 'int', nullable: true })
  weekInMonth: number;

  @Column({ type: 'int', nullable: true })
  monthInYear: number;

  /*   relations */

  @ManyToOne(() => UserEntity, (entity) => entity.practiceProcesses, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
