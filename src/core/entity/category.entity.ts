import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { NutritionEntity } from './nutrition.entity';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  /*   relations */

  @OneToMany(() => NutritionEntity, (entity) => entity.category, { cascade: ['insert', 'soft-remove'] })
  nutritions: NutritionEntity[];
}
