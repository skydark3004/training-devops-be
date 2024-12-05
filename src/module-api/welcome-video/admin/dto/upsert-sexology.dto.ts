import { IsString } from 'class-validator';

export class UpsertSexologyVideoDto {
  @IsString()
  path: string;
}
