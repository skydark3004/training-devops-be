import { Entity, Column, ManyToOne, OneToMany, JoinColumn, OneToOne, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { EnumRoleCode } from '../enum';
import { PermissionEntity } from './permission.entity';
import { ModuleEntity } from './module.entity';
import { PracticeProcessEntity } from './practice-process.entity';
import { LevelOfCustomerEntity } from './level-of-customer.entity';
import { ExperienceReviewEntity } from './experience-review.entity';
import { HistoryReadNutrition } from './history-read-nutrition.entity';
import { ActualPracticeDayEntity } from './actual-practice-day.entity';
import { PurchaseEntity } from './package-map-user.entity';
import { ActualPracticeDayMapExerciseEntity } from './actual-practice-day-map-exercise.entity';
import { FaqEntity } from './faq.entity';
import { NotificationMapUserEntity } from './notification-map-user.entity';
import { ProgressPracticeEveryDayEntity } from './progress-practice-everyday.entity';
import { LevelSexologyOfCustomerEntity } from './level-sexology-of-customer.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true, type: 'text', unique: true })
  anonymousId: string;

  @Column({ nullable: true, type: 'text', unique: true })
  username: string;

  @Column({ nullable: true, type: 'text' })
  fullName: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text', default: null, select: false })
  password: string;

  @Column({ nullable: true, type: 'text' })
  phoneNumber: string;

  @Column({ nullable: false, type: 'enum', enum: EnumRoleCode })
  roleCode: EnumRoleCode;

  @Column({ type: 'uuid', nullable: true })
  permissionId: string;

  @Column({ type: 'text', nullable: true, default: null })
  otpCode: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  otpExpiresAt: Date;

  @Column({ type: 'text', nullable: true, default: null })
  tokenForChangePassword: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  tokenExpiresAt: Date;

  @Column({ type: 'int', nullable: true, default: null })
  age: number;

  @Column({ type: 'int', nullable: true, default: null })
  stiffness: number;

  @Column({ type: 'int', nullable: true, default: null })
  sexualDuration: number;

  @Column({ type: 'int', nullable: true, default: null })
  wishDuration: number;

  @Column({ type: 'int', nullable: true, default: null, comment: 'thời gian cương hiện tại' })
  currentStiffnessDuration: number;

  @Column({ type: 'int', nullable: true, default: null, comment: 'thời gian qhtd hiện tại' })
  currentSexualDuration: number;

  @Column({ type: 'int', nullable: true, default: null, comment: 'độ cương hiện tại từ 0 đến 10' })
  currentStiffness: number;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  fcmToken: string[];

  @Column({ type: 'int', nullable: true, default: 0, comment: 'streaks luyện tập' })
  streaks: number;

  /*------------- relations--------------------------- */

  @OneToMany(() => PurchaseEntity, (entity) => entity.user)
  listPurchases: PurchaseEntity[];

  @ManyToOne(() => PermissionEntity, (entity) => entity.users, { nullable: true }) // null vs admin, super_admin
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;

  @OneToMany(() => ModuleEntity, (entity) => entity.createdByUser)
  modules: ModuleEntity[];

  @OneToMany(() => PracticeProcessEntity, (entity) => entity.user)
  practiceProcesses: PracticeProcessEntity[];

  @OneToMany(() => LevelOfCustomerEntity, (entity) => entity.user)
  levelOfCustomers: LevelOfCustomerEntity[];

  @OneToMany(() => LevelSexologyOfCustomerEntity, (entity) => entity.user)
  levelSexologyOfCustomers: LevelSexologyOfCustomerEntity[];

  @OneToMany(() => ExperienceReviewEntity, (entity) => entity.user)
  experienceReviews: ExperienceReviewEntity[];

  @OneToOne(() => HistoryReadNutrition, (profile) => profile.user)
  historyReadNutritions: HistoryReadNutrition;

  @OneToMany(() => ActualPracticeDayEntity, (profile) => profile.user)
  actualPracticeDays: ActualPracticeDayEntity[];

  @OneToMany(() => ActualPracticeDayMapExerciseEntity, (profile) => profile.user)
  actualPracticeDayMapExercises: ActualPracticeDayMapExerciseEntity[];

  @OneToMany(() => FaqEntity, (entity) => entity.createdByUser)
  faqs: FaqEntity[];

  @OneToMany(() => NotificationMapUserEntity, (entity) => entity.user)
  likeNotifications: NotificationMapUserEntity[];

  @OneToMany(() => ProgressPracticeEveryDayEntity, (entity) => entity.user)
  progressPracticeEveryDays: ProgressPracticeEveryDayEntity[];

  /* other fields */

  currentPurchase?: any;
}
