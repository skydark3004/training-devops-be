import { Type, TypeHelpOptions } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { EnumExcerciseType } from 'src/core/enum/type.enum';
import { ReelDto } from './reel.dto';
import { MusclePcDto } from './muscle-pc.dto';
import { VideoDto } from './video.dto';
import { InformationDto } from './information.dto';

export class UpdateExerciseDto {
  @IsString()
  name: string;

  @IsEnum(EnumExcerciseType)
  exerciseType: EnumExcerciseType;

  @IsString()
  description: string;

  @IsUUID()
  moduleId: string;

  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @Type((type: TypeHelpOptions) => {
    if (type.object.exerciseType === EnumExcerciseType.REEL) {
      return ReelDto;
    }
    if (type.object.exerciseType === EnumExcerciseType.MUSCLE_PC) {
      return MusclePcDto;
    }
    if (type.object.exerciseType === EnumExcerciseType.VIDEO) {
      return VideoDto;
    }

    if (type.object.exerciseType === EnumExcerciseType.INFORMATION) {
      return InformationDto;
    }
  })
  @ValidateNested({ each: true })
  details: MusclePcDto[] | ReelDto[] | VideoDto[] | InformationDto[];

  @IsOptional()
  @IsArray()
  addGuideVideos: string[] | undefined;

  @IsOptional()
  @IsArray()
  deleteGuideVideos: string[] | undefined;

  @IsOptional()
  @IsBoolean()
  isDeletedThumbnail: boolean;

  @IsOptional()
  @IsString()
  addThumbnail: string | undefined;
}
