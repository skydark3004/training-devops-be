import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base/base.entity';

@Entity('temp_file')
export class TempFileEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  path: string;
}
