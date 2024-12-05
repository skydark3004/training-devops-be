import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdatePracticeProcessEveryDayDto {
  @IsOptional()
  @IsNumber()
  stiffnessDuration: number;

  @IsOptional()
  @IsNumber()
  sexualDuration: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  stiffness: number;
}
