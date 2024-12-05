import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';
import { ExerciseEntity } from './excercise.entity';

@Entity('experience_review')
export class ExperienceReviewEntity extends BaseEntity {
  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @Column({ nullable: false, type: 'uuid' })
  exerciseId: string;

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: false, type: 'int' })
  star: number;

  /* relations */

  @ManyToOne(() => UserEntity, (entity) => entity.levelOfCustomers, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ExerciseEntity, (entity) => entity.experienceReviews, { nullable: false })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;

  /* other fields to handle  */
}
