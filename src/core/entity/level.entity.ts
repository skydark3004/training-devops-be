import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { PracticeDayEntity } from './practice-day.entity';
import { LevelOfCustomerEntity } from './level-of-customer.entity';

@Entity('level')
export class LevelEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column({ nullable: false, type: 'int' })
  totalDaysToStudy: number;

  @Column({ nullable: false, type: 'boolean', comment: 'Miễn phí', default: false })
  isFree: boolean;

  @Column({ nullable: false, type: 'int' })
  index: number;

  @Column({ nullable: true, type: 'text' })
  pathThumbnail: string;

  /*   relations */

  @OneToMany(() => PracticeDayEntity, (entity) => entity.level, { cascade: ['insert', 'soft-remove'] })
  practiceDays: PracticeDayEntity[];

  @OneToMany(() => LevelOfCustomerEntity, (entity) => entity.levelPc)
  levelOfCustomers: LevelOfCustomerEntity[];

  /* other fields to handle  */
  pathThumbnailToPreview?: string;

  isLocked?: boolean;
  isCompleted?: boolean;
  totalCompletedDays?: number;
}
