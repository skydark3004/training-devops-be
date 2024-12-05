import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { PracticeDayEntity } from './practice-day.entity';
import { ExerciseEntity } from './excercise.entity';

@Entity('practice_day_map_exercise')
export class PracticeDayMapExerciseEntity extends BaseEntity {
  @Column({ nullable: false, type: 'int', comment: 'Thứ tự bài tập trong ngày' })
  index: number;

  @Column({ nullable: false, type: 'int', comment: 'Số lần phải tập' })
  frequency: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'uuid', nullable: false })
  practiceDayId: string;

  @Column({ type: 'uuid', nullable: false })
  exerciseId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  /*  relations */

  @ManyToOne(() => PracticeDayEntity, (entity) => entity.exercisesOfEachDay, { nullable: false })
  @JoinColumn({ name: 'practiceDayId' })
  practiceDay: PracticeDayEntity;

  @ManyToOne(() => ExerciseEntity, (entity) => entity.practiceDays, { nullable: false })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;
}
