import { IsBoolean, IsString } from 'class-validator';

export class UpdateTipDto {
  @IsString()
  content: string;

  @IsBoolean()
  status: boolean;
}
