import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { EnumMusclePcType } from 'src/core/enum/type.enum';

export class EachExerciseMusclePcDto {
  @IsEnum(EnumMusclePcType)
  type: EnumMusclePcType;

  @IsNumber()
  @Min(1)
  duration: number;
}

export class MusclePcDto {
  @IsString()
  nameOfStep: string;

  @Type(() => EachExerciseMusclePcDto)
  @ValidateNested({ each: true })
  @IsArray()
  details: EachExerciseMusclePcDto[];
}
