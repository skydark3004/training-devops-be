import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNutritionDto {
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

  @IsBoolean()
  isFree: boolean;
}
