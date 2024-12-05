import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/core/dto';
import { EnumTypeOfNotification } from 'src/core/enum';
import { ParseBooleanStringTrueFalse } from 'src/pipe';

export class ListNotificationDto extends PaginationDto {
  @IsOptional()
  keySearch: string;

  @IsOptional()
  @ParseBooleanStringTrueFalse({ isIgnoreIfUndefined: true })
  status: boolean;

  @IsOptional()
  @IsEnum(EnumTypeOfNotification)
  type: EnumTypeOfNotification;
}
