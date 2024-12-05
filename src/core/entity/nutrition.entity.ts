import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { CategoryEntity } from './category.entity';

@Entity('nutrition')
export class NutritionEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column({ nullable: false, type: 'int' })
  index: number;

  @Column({ nullable: false, type: 'boolean', comment: 'Miễn phí', default: false })
  isFree: boolean;

  @Column({ type: 'text', nullable: true })
  pathThumbnail: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  @Column({ type: 'uuid', nullable: false })
  categoryId: string;

  /*   relations */

  @ManyToOne(() => CategoryEntity, (entity) => entity.nutritions, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  /* other fields to handle  */
  isAllowedToRead?: boolean;
  isRead?: boolean;
}
