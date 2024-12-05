import { Type, TypeHelpOptions } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { EnumExcerciseType } from 'src/core/enum/type.enum';
import { IsNullable } from 'src/validators';
import { ReelDto } from './reel.dto';
import { MusclePcDto } from './muscle-pc.dto';
import { VideoDto } from './video.dto';
import { InformationDto } from './information.dto';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsEnum(EnumExcerciseType)
  exerciseType: EnumExcerciseType;

  @IsString()
  description: string;

  @IsString()
  @IsNullable()
  thumbnail: string;

  @IsArray()
  guideVideos: string[];

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

  @IsBoolean()
  status: boolean;

  @IsUUID()
  moduleId: string;
}
