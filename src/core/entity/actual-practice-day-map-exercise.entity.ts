import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ExerciseEntity } from './excercise.entity';
import { ActualPracticeDayEntity } from './actual-practice-day.entity';
import { UserEntity } from './user.entity';

@Entity('actual_practice_day_map_exercise')
export class ActualPracticeDayMapExerciseEntity extends BaseEntity {
  @Column({ nullable: false, type: 'int' })
  index: number;

  @Column({ nullable: false, type: 'int' })
  frequency: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'uuid', nullable: false })
  actualPracticeDayId: string;

  @Column({ type: 'uuid', nullable: false })
  exerciseId: string;

  @Column({ type: 'jsonb', nullable: false })
  exerciseCloneData: ExerciseEntity;

  @Column({ nullable: false, type: 'int', default: 0 })
  currentPracticeTimes: number;

  @Column({ nullable: false, type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  /*  relations */

  @ManyToOne(() => ActualPracticeDayEntity, (entity) => entity.exercisesInThatDay, { nullable: false })
  @JoinColumn({ name: 'actualPracticeDayId' })
  actualPracticeDay: ActualPracticeDayEntity;

  @ManyToOne(() => ExerciseEntity, (entity) => entity.practiceDays, { nullable: false })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.actualPracticeDays, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
