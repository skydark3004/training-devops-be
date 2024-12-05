import { IsNumber } from 'class-validator';

export class GetRevenueDto {
  @IsNumber()
  year: number;
}
