import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { PaginationDto } from 'src/core/dto';

import { ParseBooleanStringTrueFalse } from 'src/pipe';
import { IsNullable } from 'src/validators';

export class ListLevelDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;
}

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

export class CreateLevelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  index: number;

  @IsNullable()
  @IsString()
  pathThumbnail: string | null;

  @IsBoolean()
  status: boolean;

  @Type(() => DayDto)
  @ValidateNested({ each: true })
  @IsArray()
  days: DayDto[];
}

export class UpdateLevelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  index: number;

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
