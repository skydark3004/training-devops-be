import { IsBoolean, IsEnum, IsString, IsOptional, ValidateIf } from 'class-validator';
import { EnumTypeOfContent, EnumTypeOfNotification } from 'src/core/enum';
import { IsDateFormatString } from 'src/validators';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  @IsDateFormatString()
  date: string;

  @IsString()
  description: string;

  @IsOptional()
  pathThumbnail: string;

  @IsEnum(EnumTypeOfNotification)
  type: EnumTypeOfNotification;

  @IsBoolean()
  status: boolean;

  @IsBoolean()
  isNotifyForCustomer: boolean;

  @IsEnum(EnumTypeOfContent)
  typeOfContent: EnumTypeOfContent;

  @IsString()
  @ValidateIf((object) => object.typeOfContent === EnumTypeOfContent.ARTICLE)
  content: string;

  @IsString()
  @ValidateIf((object) => object.typeOfContent === EnumTypeOfContent.URL)
  url: string;
}
