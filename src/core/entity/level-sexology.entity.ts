import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { LevelSexologyMapExerciseEntity } from './level-sexology-map-exercise.entity';
import { ModuleEntity } from './module.entity';
import { LevelSexologyOfCustomerEntity } from './level-sexology-of-customer.entity';
import { EnumTypeOfPractice } from '../enum';

@Entity('level_sexology')
export class LevelSexologyEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' /* , unique: true */ })
  name: string;

  @Column({ type: 'uuid', nullable: false })
  moduleId: string;

  @Column({ nullable: false, type: 'boolean', comment: 'Miễn phí', default: false })
  isFree: boolean;

  @Column({ nullable: false, type: 'int', default: 0 })
  index: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  totalDaysMustLearn: number;

  @Column({ nullable: true, type: 'int', default: null })
  totalTimesToPractice: number;

  @Column({ nullable: true, type: 'varchar', length: 100, default: EnumTypeOfPractice.PER_WEEK })
  typeOfPractice: EnumTypeOfPractice;

  @Column({ nullable: true, type: 'text' })
  pathThumbnail: string | null;

  @Column({ nullable: true, type: 'text' })
  pathThumbnailToPreview: string | null;

  /*   relations */

  @ManyToOne(() => ModuleEntity, (entity) => entity.levelSexologies)
  @JoinColumn({ name: 'moduleId' })
  module: ModuleEntity;

  @OneToMany(() => LevelSexologyMapExerciseEntity, (entity) => entity.LevelSexology, { cascade: ['insert', 'soft-remove'] })
  listExercises: LevelSexologyMapExerciseEntity[];

  @OneToMany(() => LevelSexologyOfCustomerEntity, (entity) => entity.levelSexology)
  levelOfCustomers: LevelSexologyOfCustomerEntity[];
}
