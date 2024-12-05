import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base/base.entity';

@Entity('welcome_video')
export class WelcomeVideoEntity extends BaseEntity {
  @Column({ nullable: true, type: 'text', default: null })
  sexology: string;

  @Column({ nullable: true, type: 'text', default: null })
  first: string;

  @Column({ nullable: false, type: 'text', default: null })
  second: string;

  @Column({ nullable: false, type: 'text', default: null })
  third: string;

  @Column({ nullable: true, type: 'text', default: 'DEFAULT' })
  code: 'DEFAULT';

  firstToPreview?: string;
  secondToPreview?: string;
  thirdToPreview?: string;
  sexologyToPreview?: string;
}
