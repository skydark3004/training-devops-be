import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { EnumTypeOfContent, EnumTypeOfNotification } from '../enum';
import { NotificationMapUserEntity } from './notification-map-user.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  title: string;

  @Column({ nullable: true, type: 'date', default: null })
  date: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text', default: null })
  pathThumbnail: string;

  @Column({ nullable: false, type: 'int', default: 0 })
  totalLikes: number;

  @Column({ nullable: false, type: 'enum', enum: EnumTypeOfNotification })
  type: EnumTypeOfNotification;

  @Column({ nullable: false, type: 'boolean', default: false })
  isNotifyForCustomer: boolean;

  @Column({ nullable: false, type: 'enum', enum: EnumTypeOfContent })
  typeOfContent: EnumTypeOfContent;

  @Column({ nullable: true, type: 'text', comment: 'html', default: null })
  content: string;

  @Column({ nullable: true, type: 'text', default: null })
  url: string;

  /*   relations */

  @OneToMany(() => NotificationMapUserEntity, (entity) => entity.notification)
  usersLike: NotificationMapUserEntity[];

  /* other fields */
  pathThumbnailToPreview: string;
}
