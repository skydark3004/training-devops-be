import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { RoleCodeEnum, StatusEnum } from '../enum';
import { GenderTypesEnum } from '../enum/type.enum';
import { Permission } from './permission.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  username: string;

  @Column({ nullable: false, type: 'text' })
  fullName: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'text', select: false })
  password: string;

  @Column({ nullable: true, type: 'text' })
  phoneNumber: string;

  @Column({ nullable: true, type: 'enum', enum: GenderTypesEnum })
  gender: GenderTypesEnum;

  @Column({ nullable: false, type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @Column({ nullable: false, type: 'enum', enum: RoleCodeEnum })
  roleCode: RoleCodeEnum;

  @ManyToOne(() => Permission, (permission) => permission.users, { nullable: true }) // null vs admin, super_admin
  permission: Permission;
}
