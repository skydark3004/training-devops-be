import { IsEnum, IsOptional } from 'class-validator';
import { EnumTypeOfNotification } from 'src/core/enum';

export class GetAllNotificationDto {
  @IsOptional()
  @IsEnum(EnumTypeOfNotification)
  type: EnumTypeOfNotification;
}
