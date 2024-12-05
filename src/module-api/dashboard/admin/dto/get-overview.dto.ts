import { IsDateString, IsString } from 'class-validator';

export class GetOverviewDto {
  @IsString()
  @IsDateString()
  startDate: number;

  @IsString()
  @IsDateString()
  endDate: number;
}
