import { IsString } from 'class-validator';

export class UpsertWelcomeVideoDto {
  @IsString()
  first: string;

  @IsString()
  second: string;

  @IsString()
  third: string;
}
