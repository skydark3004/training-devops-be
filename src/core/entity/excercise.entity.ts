import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { EnumExcerciseType } from '../enum/type.enum';
import { ModuleEntity } from './module.entity';
import { PracticeDayMapExerciseEntity } from './practice-day-map-exercise.entity';
import { LevelSexologyMapExerciseEntity } from './level-sexology-map-exercise.entity';
import { ExperienceReviewEntity } from './experience-review.entity';

@Entity('exercise')
export class ExerciseEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' /* unique: true  */ })
  name: string;

  @Column({ nullable: false, type: 'enum', enum: EnumExcerciseType })
  exerciseType: EnumExcerciseType;

  @Column({ nullable: true, type: 'text', default: '' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  thumbnail: string;

  @Column({ type: 'text', nullable: true, array: true })
  guideVideos: string[];

  @Column({ type: 'jsonb', nullable: false })
  details: any;

  @Column({ type: 'uuid', nullable: false })
  moduleId: string;

  @ManyToOne(() => ModuleEntity, (entity) => entity.excercises, { nullable: false })
  @JoinColumn({ name: 'moduleId' })
  module: ModuleEntity;

  @OneToMany(() => PracticeDayMapExerciseEntity, (entity) => entity.exercise)
  practiceDays: PracticeDayMapExerciseEntity[];

  @OneToMany(() => LevelSexologyMapExerciseEntity, (entity) => entity.exercise)
  levelSexologyMapExercise: LevelSexologyMapExerciseEntity[];

  @OneToMany(() => ExperienceReviewEntity, (entity) => entity.exercise)
  experienceReviews: ExperienceReviewEntity[];

  /* other fields to handle  */
  guideVideosToPreview: string[];
  thumbnailToPreview: string;
}

/*   // cơ PC
  musclePcType: string; // dồn dập | nghỉ | co ngắn
  duration: number;

  // reel
  stepNameOfReel: string;
  nameButtonOfReel: string;
  reelType: string;
  videoReelUrl?: string; // reelType = hướng dẫn + Luyện tập
  reelDuration?: number; // Thời gian đếm ngược - reelType = Luyện tập

  // video
  videoType: string; // video | trả lời | trả lời liên tục
  videoUrl?: string; // videoType = video
  content?: string; // videoType = trả lời + trả lời liên tục
  nameButtonOfVideo?: string; // videoType = trả lời

  // tin
  stepNameOfInformation: string;
  nameButtonOfInformation: string;
  informationType: string; // Hình ảnh | Văn bản in đậm | Văn bản thường | Văn bản cỡ lớn | Lựa chọn | Audio | Tính điểm và phân tích
  imageUrlOfInformation: string; //  informationType = Hình ảnh */
