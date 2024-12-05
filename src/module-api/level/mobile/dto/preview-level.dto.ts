import { IsEnum } from 'class-validator';
import { EnumPreviewLeveType } from '../level.enum';

export class PreviewLevelDto {
  @IsEnum(EnumPreviewLeveType)
  type: EnumPreviewLeveType;
}
