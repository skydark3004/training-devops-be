import { IsString } from 'class-validator';

export class SubscribeByPackageIdDto {
  @IsString()
  transactionId: string;

  @IsString()
  platform: string;
}
