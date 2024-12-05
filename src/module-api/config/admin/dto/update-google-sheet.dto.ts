import { IsNumber } from 'class-validator';

export class UpdateGoogleSheetDto {
  @IsNumber()
  eachHourToRunCronJob: number;
}
