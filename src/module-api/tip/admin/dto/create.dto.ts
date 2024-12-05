import { IsBoolean, IsString } from 'class-validator';

export class CreateTipDto {
  @IsString()
  content: string;

  @IsBoolean()
  status: boolean;
}
