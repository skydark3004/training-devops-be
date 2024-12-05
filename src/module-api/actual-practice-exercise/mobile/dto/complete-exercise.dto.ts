import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CompleteExerciseDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  star: number;
}
