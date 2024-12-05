import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { LevelEntity } from './level.entity';
import { UserEntity } from './user.entity';
import { ActualPracticeDayEntity } from './actual-practice-day.entity';

@Entity('level_of_customer')
export class LevelOfCustomerEntity extends BaseEntity {
  @Column({ nullable: true, type: 'uuid' })
  levelPcId: string;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  isCompleted: boolean;

  /*   @Column({ nullable: true, type: 'text', default: null })
  name: string; */

  @Column({ nullable: false, type: 'int' })
  totalDaysToStudy: number;

  @Column({ nullable: false, type: 'int' })
  index: number;

  @DeleteDateColumn()
  deletedAt: Date;

  /*   @Column({ nullable: true, type: 'text', default: null })
  pathThumbnail: string; */

  /*   relations */

  @ManyToOne(() => LevelEntity, (entity) => entity.levelOfCustomers, { nullable: false })
  @JoinColumn({ name: 'levelPcId' })
  levelPc: LevelEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.levelOfCustomers, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => ActualPracticeDayEntity, (entity) => entity.levelOfCustomer)
  actualPracticeDays: ActualPracticeDayEntity[];

  /* other fields to handle  */
  pathThumbnailToPreview: string;
  exericsesToday?: any;
  totalDaysToPractice?: number;
  totalDaysDone?: number;
  actualPracticeDayId?: string;
}
