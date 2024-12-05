import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';
import { LevelSexologyEntity } from './level-sexology.entity';
import { LevelSexologyOfCustomerMapExerciseEntity } from './level-sexology-of-customer-map-exercise.entity';
import { ModuleEntity } from './module.entity';
import { EnumTypeOfPractice } from '../enum';

@Entity('level_sexology_of_customer')
export class LevelSexologyOfCustomerEntity extends BaseEntity {
  @Column({ nullable: false, type: 'uuid' })
  levelSexologyId: string;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ nullable: false, type: 'int' })
  totalExercises: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  totalDoneExercises: number;

  @Column({ nullable: false, type: 'int', comment: 'Thứ tự của level tâm lý tình dục' })
  index: number;

  @Column({ type: 'uuid', nullable: false })
  moduleId: string;

  @Column({ nullable: false, type: 'int' })
  totalDaysMustLearn: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  currentLearnDays: number;

  @Column({ nullable: true, type: 'int', default: null })
  totalTimesToPractice: number;

  @Column({ nullable: true, type: 'varchar', length: 100, default: EnumTypeOfPractice.PER_WEEK })
  typeOfPractice: EnumTypeOfPractice;

  /*   relations */

  @ManyToOne(() => LevelSexologyEntity, (entity) => entity.levelOfCustomers, { nullable: false })
  @JoinColumn({ name: 'levelSexologyId' })
  levelSexology: LevelSexologyEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.levelSexologyOfCustomers, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => LevelSexologyOfCustomerMapExerciseEntity, (entity) => entity.levelSexologyOfCustomer)
  actualExercises: LevelSexologyOfCustomerMapExerciseEntity[];

  @ManyToOne(() => ModuleEntity, (entity) => entity.levelSexologies)
  @JoinColumn({ name: 'moduleId' })
  module: ModuleEntity;

  /* other fields to handle  */
}
