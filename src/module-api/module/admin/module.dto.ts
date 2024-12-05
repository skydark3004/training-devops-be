import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumStudyProgramCode } from 'src/core/enum';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListModuleDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;

  @IsOptional()
  @IsEnum(EnumStudyProgramCode)
  studyProgramCode: EnumStudyProgramCode;
}

export class CreateModuleDto {
  @IsString()
  name: string;

  @IsEnum(EnumStudyProgramCode)
  studyProgramCode: EnumStudyProgramCode;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  @ValidateIf((object) => object.studyProgramCode === EnumStudyProgramCode.SEXOLOGY)
  index: number;

  @IsOptional()
  @IsString()
  path: string;
}

export class UpdateModuleDto {
  @IsString()
  name: string;

  @IsEnum(EnumStudyProgramCode)
  studyProgramCode: EnumStudyProgramCode;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  path: string;

  @IsNumber()
  @ValidateIf((object) => object.studyProgramCode === EnumStudyProgramCode.SEXOLOGY)
  index: number;
}
