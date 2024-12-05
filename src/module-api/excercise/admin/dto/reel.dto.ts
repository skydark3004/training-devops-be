import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { EnumScreenTypeOfReel } from 'src/core/enum/type.enum';

export class ReelDto {
  @IsString()
  path: string;

  @IsEnum(EnumScreenTypeOfReel)
  typeOfScreen: EnumScreenTypeOfReel;

  @IsString()
  nameOfStep: string;

  @IsString()
  nameOfButton: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfReel.PRACTICE)
  @IsNumber()
  countdownTime?: number;

  pathToPreview?: string;
}
