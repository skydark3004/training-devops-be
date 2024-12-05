import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNumber, IsString, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import {
  EnumScreenTypeOfInformation,
  EnumTypeComponentOfFlexibleScreen,
  EnumTypeDisplayOfInformationScreen,
  EnumTypeOfAlignOfFlexibleScreen,
} from 'src/core/enum/type.enum';

class MoreComponentDto {
  @IsEnum(EnumTypeComponentOfFlexibleScreen)
  type: EnumTypeComponentOfFlexibleScreen;

  @ValidateIf(
    (object) =>
      object.type === EnumTypeComponentOfFlexibleScreen.TEXT_BOLD ||
      object.type === EnumTypeComponentOfFlexibleScreen.TEXT_LARGE ||
      object.type === EnumTypeComponentOfFlexibleScreen.TEXT_NORMAL,
  )
  @IsString()
  content: string;

  @ValidateIf((object) => object.type === EnumTypeComponentOfFlexibleScreen.IMAGE)
  @IsString()
  path: string;

  @IsNumber()
  index: number;

  @IsEnum(EnumTypeOfAlignOfFlexibleScreen)
  typeOfAlign: EnumTypeOfAlignOfFlexibleScreen;

  @ValidateIf((object) => object.type === EnumTypeComponentOfFlexibleScreen.SPACE)
  @IsNumber()
  space: number;

  @ValidateIf((object) => object.type === EnumTypeComponentOfFlexibleScreen.BACK)
  @IsString()
  nameOfButtonBack: number;

  imagePathToPreview?: string;
}

export class InformationDto {
  @IsString()
  nameOfStep: string;

  @IsString()
  nameOfButton: string;

  @IsEnum(EnumScreenTypeOfInformation)
  typeOfScreen: EnumScreenTypeOfInformation;

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.FLEXIBLE)
  @Type(() => MoreComponentDto)
  @ValidateNested({ each: true })
  moreComponents?: MoreComponentDto[];

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.MULTIPLE_CHOICES)
  @IsString()
  questionOfMutilpleChoices: string;

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.MULTIPLE_CHOICES)
  @IsArray()
  @IsString({ each: true })
  listMutilpleChoices: string[];

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.AUDIO)
  @IsEnum(EnumTypeDisplayOfInformationScreen)
  howToDisplay: EnumTypeDisplayOfInformationScreen;

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.AUDIO)
  @IsString()
  audioPath: string;
  audioPathToPreview?: string;

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.AUDIO)
  @IsString()
  imagePath: string;
  imagePathToPreview?: string;

  @ValidateIf((object) => object.typeOfScreen == EnumScreenTypeOfInformation.AUDIO)
  @IsString()
  contentOfVideo: string;

  // ---- Loại màn hình Loại bỏ suy nghĩ tiêu cực
  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING)
  @IsNumber()
  @Min(1)
  @Max(5)
  stepOfRemoveNegativeThinking: number;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING && object.stepOfRemoveNegativeThinking === 1)
  @IsString()
  largeTextStep1?: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING && object.stepOfRemoveNegativeThinking === 2)
  @IsString()
  questionStep2: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING && object.stepOfRemoveNegativeThinking === 2)
  @IsArray()
  listPlaceholderStep2: string[];

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING && object.stepOfRemoveNegativeThinking === 3)
  @Type(() => QuestionOfInformationScreenDto)
  @ValidateNested({ each: true })
  listQuestionStep3: QuestionOfInformationScreenDto[];

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING && object.stepOfRemoveNegativeThinking === 4)
  questionStep4?: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.REMOVE_NAGATIVE_THINKING && object.stepOfRemoveNegativeThinking === 5)
  largeTextStep5?: string;

  // ---- Loại màn hình Tính point
  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE)
  @IsNumber()
  @Min(1)
  @Max(2)
  stepOfPointAnalyze: number;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 1)
  @IsString()
  normalTextStep1: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 1)
  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  listQuestionStep1: string[];

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 2)
  @IsString()
  largeTextStep2: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 2)
  @IsString()
  normalTextStep2: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 2)
  @IsString()
  textToDisplayStartChangesStep2: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 2)
  @IsString()
  textToDisplayDoNothingStep2: string;

  @ValidateIf((object) => object.typeOfScreen === EnumScreenTypeOfInformation.POINT_ANALYZE && object.stepOfPointAnalyze === 2)
  @IsString()
  boldTextStep2: string;
}

class QuestionOfInformationScreenDto {
  @IsString()
  question: string;

  @IsString()
  placeholder: string;
}
