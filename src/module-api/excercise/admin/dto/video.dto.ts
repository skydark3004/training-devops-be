import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { EnumScreenTypeOfVideo } from 'src/core/enum/type.enum';

export class VideoDto {
  @IsEnum(EnumScreenTypeOfVideo)
  typeOfScreen: EnumScreenTypeOfVideo;

  @IsString()
  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfVideo.VIDEO)
  path?: string;
  pathToPreview?: string;

  @IsString()
  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfVideo.ANSWER)
  nameOfButton?: string;

  @IsString()
  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfVideo.ANSWER || object.typeOfScreen === EnumScreenTypeOfVideo.ANSWER_CONTINOUSLY)
  content?: string;
}
