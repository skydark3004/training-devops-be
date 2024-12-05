import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumStudyProgramCode } from 'src/core/enum';

export class ListExerciseDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @IsUUID()
  moduleId: string;

  @IsOptional()
  @IsEnum(EnumStudyProgramCode)
  studyProgramCode: EnumStudyProgramCode;
}
