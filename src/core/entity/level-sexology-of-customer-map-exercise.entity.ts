import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ExerciseEntity } from './excercise.entity';
import { UserEntity } from './user.entity';
import { LevelSexologyOfCustomerEntity } from './level-sexology-of-customer.entity';

@Entity('level_sexology_of_customer_map_exercise')
export class LevelSexologyOfCustomerMapExerciseEntity extends BaseEntity {
  @Column({ nullable: false, type: 'int' })
  index: number;

  @Column({ type: 'uuid', nullable: false })
  levelOfCustomerId: string;

  @Column({ type: 'uuid', nullable: false })
  exerciseId: string;

  @Column({ type: 'jsonb', nullable: false })
  exerciseCloneData: ExerciseEntity | any;

  @Column({ nullable: false, type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  /*  relations */

  @ManyToOne(() => LevelSexologyOfCustomerEntity, (entity) => entity.actualExercises, { nullable: false })
  @JoinColumn({ name: 'levelOfCustomerId' })
  levelSexologyOfCustomer: LevelSexologyOfCustomerEntity;

  @ManyToOne(() => ExerciseEntity, (entity) => entity.practiceDays, { nullable: false })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.actualPracticeDays, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
