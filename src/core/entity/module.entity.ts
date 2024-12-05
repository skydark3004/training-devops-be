import { StringUtil } from './../../libs/utils/string.util';
import { AfterLoad, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EnumStudyProgramCode } from '../enum';
import { BaseEntity } from './base/base.entity';
import { UserEntity } from './user.entity';
import { ExerciseEntity } from './excercise.entity';
import { APP_CONFIG } from 'src/configs/app.config';
import { LevelSexologyEntity } from './level-sexology.entity';
import { LevelSexologyOfCustomerEntity } from './level-sexology-of-customer.entity';

@Entity('module')
export class ModuleEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text', unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  nameToSearch: string;

  @Column({ nullable: false, type: 'enum', enum: EnumStudyProgramCode })
  studyProgramCode: EnumStudyProgramCode;

  @Column({ type: 'uuid', nullable: false })
  createdByUserId: string;

  @OneToMany(() => ExerciseEntity, (entity) => entity.module)
  excercises: ExerciseEntity[];

  @Column({ nullable: true, type: 'text' })
  path: string;

  @ManyToOne(() => UserEntity, (entity) => entity.modules, { nullable: false })
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: UserEntity;

  @OneToMany(() => LevelSexologyEntity, (entity) => entity.module)
  levelSexologies: LevelSexologyEntity[];

  @OneToMany(() => LevelSexologyOfCustomerEntity, (entity) => entity.module)
  levelSexologiesOfCustomer: LevelSexologyOfCustomerEntity[];

  @Column({ nullable: true, type: 'int' })
  index: number;

  @AfterLoad()
  updateFullUrl() {
    if (this.path) {
      this.url = `${APP_CONFIG.ENV.STORAGE.DOMAIN}/${this.path}`;
    }
  }

  @BeforeInsert()
  updateNameToSearchBeforeInsert() {
    this.nameToSearch = StringUtil.convertVNToEnglish(this.name);
  }

  url: string;
}
