import { Column, Entity, OneToMany } from 'typeorm';
import { PermissionEnum, StatusEnum } from '../enum';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column('text', { nullable: false, array: true })
  details: PermissionEnum[];

  @Column({ nullable: false, type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @OneToMany(() => User, (user) => user.permission)
  users: User[];
}
