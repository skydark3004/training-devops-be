import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { LevelEntity } from './level.entity';
import { PracticeDayMapExerciseEntity } from './practice-day-map-exercise.entity';
import { ActualPracticeDayEntity } from './actual-practice-day.entity';

@Entity('practice_day')
export class PracticeDayEntity extends BaseEntity {
  @Column({ nullable: false, type: 'int' })
  totalExercises: number;

  @Column({ nullable: false, type: 'int' })
  index: number;

  @Column({ type: 'uuid', nullable: false })
  levelId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  /* relations */

  @ManyToOne(() => LevelEntity, (entity) => entity.practiceDays, { nullable: false })
  @JoinColumn({ name: 'levelId' })
  level: LevelEntity;

  @OneToMany(() => PracticeDayMapExerciseEntity, (entity) => entity.practiceDay, { cascade: ['insert', 'soft-remove'] })
  exercisesOfEachDay: PracticeDayMapExerciseEntity[];

  @OneToMany(() => PracticeDayMapExerciseEntity, (entity) => entity.practiceDay)
  actualPracticeDays: ActualPracticeDayEntity[];
}
