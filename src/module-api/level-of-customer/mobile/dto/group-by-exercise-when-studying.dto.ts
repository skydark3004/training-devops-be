import { IsEnum } from 'class-validator';
import { EnumGroupByExericseWhenStudyingType } from '../level-of-customer.enum';

export class GroupByExericseWhenStudyingDto {
  @IsEnum(EnumGroupByExericseWhenStudyingType)
  type: EnumGroupByExericseWhenStudyingType;
}
