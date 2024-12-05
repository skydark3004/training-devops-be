import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';

@Entity('nutrition_map_user')
export class HistoryReadNutrition extends BaseEntity {
  @Column({ type: 'jsonb', nullable: false })
  listInArray: any[];

  @Column({ type: 'jsonb', nullable: false })
  listInObject: any;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  /*   relations */
  @OneToOne(() => UserEntity, (profile) => profile.historyReadNutritions)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
