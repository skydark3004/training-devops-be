import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { LevelOfCustomerEntity } from './level-of-customer.entity';
import { PracticeDayEntity } from './practice-day.entity';
import { ActualPracticeDayMapExerciseEntity } from './actual-practice-day-map-exercise.entity';
import { UserEntity } from './user.entity';

@Entity('actual_practice_day')
export class ActualPracticeDayEntity extends BaseEntity {
  @Column({ nullable: false, type: 'uuid' })
  levelOfCustomerId: string;

  @Column({ nullable: true, type: 'uuid' })
  practiceDayId: string;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ nullable: false, type: 'int' })
  totalExercises: number;

  @Column({ nullable: false, type: 'int' })
  index: number; // ngày thứ bao nhiêu

  /*   relations */

  @ManyToOne(() => LevelOfCustomerEntity, (entity) => entity.actualPracticeDays, { nullable: false })
  @JoinColumn({ name: 'levelOfCustomerId' })
  levelOfCustomer: LevelOfCustomerEntity;

  @OneToMany(() => ActualPracticeDayMapExerciseEntity, (entity) => entity.actualPracticeDay, { cascade: ['insert', 'soft-remove'] })
  exercisesInThatDay: ActualPracticeDayMapExerciseEntity[];

  @ManyToOne(() => PracticeDayEntity, (entity) => entity.actualPracticeDays, { nullable: false })
  @JoinColumn({ name: 'practiceDayId' })
  practiceDay: PracticeDayEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.actualPracticeDays, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
