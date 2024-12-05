import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateNutritionDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  index: number;

  @IsOptional()
  pathThumbnail: string | null;

  @IsString()
  content: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsBoolean()
  isFree: boolean;
}
