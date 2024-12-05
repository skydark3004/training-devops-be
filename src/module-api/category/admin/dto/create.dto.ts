import { IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;
}
