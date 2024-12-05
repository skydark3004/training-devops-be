import { IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EnumTypeOfFaq, EnumTypeOfShowFaq } from 'src/core/enum';

export class CreateFaqDto {
  @IsString()
  title: string;

  @IsOptional()
  pathThumbnail: string;

  @IsEnum(EnumTypeOfFaq)
  type: EnumTypeOfFaq;

  @IsEnum(EnumTypeOfShowFaq)
  typeOfShow: EnumTypeOfShowFaq;

  @IsString()
  @ValidateIf((object) => object.type === EnumTypeOfFaq.ARTICLE)
  content: string;

  @IsString()
  @ValidateIf((object) => object.type === EnumTypeOfFaq.URL)
  url: string;

  @IsString()
  @ValidateIf((object) => object.type === EnumTypeOfFaq.VIDEO)
  pathVideo: string;

  @IsBoolean()
  status: boolean;
}
