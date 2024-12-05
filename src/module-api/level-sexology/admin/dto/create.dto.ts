import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { EnumTypeOfPractice } from 'src/core/enum';

class EachExercise {
  @IsUUID()
  exerciseId: string;

  @IsNumber()
  index: number;
}

export class CreateLevelSexologyDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;

  @IsBoolean()
  isFree: boolean;

  @Type(() => EachExercise)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayUnique((value) => value.index)
  listExericses: EachExercise[];

  @IsUUID()
  moduleId: string;

  @IsNumber()
  index: number;

  @IsNumber()
  @Min(1)
  totalDaysMustLearn: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  totalTimesToPractice: number;

  @IsEnum(EnumTypeOfPractice)
  typeOfPractice: EnumTypeOfPractice;

  @IsOptional()
  pathThumbnail: string | null;
}
