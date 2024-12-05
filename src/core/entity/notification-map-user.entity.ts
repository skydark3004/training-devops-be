import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from './user.entity';

@Entity('notification_map_user')
@Unique('userId_notificationId_unique', ['userId', 'notificationId'])
export class NotificationMapUserEntity extends BaseEntity {
  @Column({ nullable: false, type: 'uuid' })
  notificationId: string;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  /*   relations */

  @ManyToOne(() => NotificationEntity, (entity) => entity.usersLike, { nullable: false })
  @JoinColumn({ name: 'notificationId' })
  notification: NotificationEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.likeNotifications, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
