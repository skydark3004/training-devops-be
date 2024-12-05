import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base/base.entity';

@Entity('tip')
export class TipEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  content: string;
}
