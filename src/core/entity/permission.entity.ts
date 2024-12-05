import { Column, Entity, OneToMany } from 'typeorm';
import { EnumPermission } from '../enum';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';

@Entity('permission')
export class PermissionEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column('text', { nullable: false, array: true })
  details: EnumPermission[];

  @OneToMany(() => UserEntity, (entity) => entity.permission)
  users: UserEntity[];
}
