import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { IsNullable } from 'src/validators';

class DetailOfDayDto {
  @IsUUID()
  exerciseId: string;

  @IsNumber()
  frequency: number;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  index: number;

  @IsOptional()
  @IsUUID()
  id: string;
}

class DayDto {
  @IsNumber()
  @Min(1)
  totalExercises: number;

  @Type(() => DetailOfDayDto)
  @ValidateNested({ each: true })
  @IsArray()
  details: DetailOfDayDto[];

  @IsOptional()
  @IsUUID()
  id: string;
}

export class UpdateLevelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  index: number;

  @IsBoolean()
  isFree: boolean;

  @IsNullable()
  @IsOptional()
  pathThumbnail: string | null;

  @IsBoolean()
  status: boolean;

  @Type(() => DayDto)
  @ValidateNested({ each: true })
  @IsArray()
  days: DayDto[];
}
