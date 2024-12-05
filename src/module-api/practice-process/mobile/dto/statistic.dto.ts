import { IsEnum } from 'class-validator';
import { EnumTypeStatistic } from '../../practice-process.enum';

export class StatisticDto {
  @IsEnum(EnumTypeStatistic)
  type: EnumTypeStatistic;
}
