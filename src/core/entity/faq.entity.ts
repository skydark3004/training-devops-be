import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base/base.entity';
import { EnumTypeOfFaq, EnumTypeOfShowFaq } from '../enum';
import { UserEntity } from './user.entity';

@Entity('faq')
export class FaqEntity extends BaseEntity {
  @Column({ nullable: true, type: 'text' })
  pathThumbnail: string;

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: false, type: 'text' })
  title: string;

  @Column({ nullable: false, type: 'enum', enum: EnumTypeOfFaq })
  type: EnumTypeOfFaq;

  @Column({ nullable: false, type: 'enum', enum: EnumTypeOfShowFaq, default: EnumTypeOfShowFaq.LARGE_THUMBNAIL })
  typeOfShow: EnumTypeOfShowFaq;

  @Column({ nullable: true, type: 'text', default: null })
  url: string;

  @Column({ nullable: true, type: 'text', default: null })
  pathVideo: string;

  @Column({ type: 'uuid', nullable: false })
  createdByUserId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.modules, { nullable: false })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: UserEntity;

  /* other fields to handle  */
  pathThumbnailToPreview: string;
  pathVideoToPreview: string;
}
