import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  age: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  stiffness: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sexualDuration: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wishDuration: number;
}
