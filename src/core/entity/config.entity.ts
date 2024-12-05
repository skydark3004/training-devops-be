import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { EnumConfigCode } from '../enum';
import { IBankInformation, IGoogleSheetConfig } from '../interfaces';

@Entity('config')
export class ConfigEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  code: EnumConfigCode;

  @Column({ type: 'jsonb', nullable: false })
  value: IGoogleSheetConfig | IBankInformation;
}
