import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { EnumTypeOfPractice } from 'src/core/enum';

class EachExercise {
  @IsUUID()
  exerciseId: string;

  @IsNumber()
  index: number;

  @IsOptional()
  @IsUUID()
  id: string;
}

export class UpdateLevelSexologyDto {
  @IsString()
  name: string;

  @IsBoolean()
  isFree: boolean;

  @IsBoolean()
  status: boolean;

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
