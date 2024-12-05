import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ExerciseEntity } from './excercise.entity';
import { LevelSexologyEntity } from './level-sexology.entity';

@Entity('level_sexology_map_exercise')
export class LevelSexologyMapExerciseEntity extends BaseEntity {
  @Column({ nullable: false, type: 'int' })
  index: number;

  @Column({ type: 'uuid', nullable: false })
  levelSexologyId: string;

  @Column({ type: 'uuid', nullable: false })
  exerciseId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  /*  relations */

  @ManyToOne(() => LevelSexologyEntity, (entity) => entity.listExercises, { nullable: false })
  @JoinColumn({ name: 'levelSexologyId' })
  LevelSexology: LevelSexologyEntity;

  @ManyToOne(() => ExerciseEntity, (entity) => entity.levelSexologyMapExercise, { nullable: false })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;
}
