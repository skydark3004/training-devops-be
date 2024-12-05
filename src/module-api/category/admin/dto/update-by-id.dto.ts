import { IsBoolean, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;
}
