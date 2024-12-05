import { Module } from '@nestjs/common';

import { UploadServiceAdmin } from './admin/upload.service';
import { UploadControllerAdmin } from './admin/upload.controller';

@Module({
  imports: [],
  controllers: [UploadControllerAdmin],
  providers: [UploadServiceAdmin],
  exports: [UploadServiceAdmin],
})
export class UploadModule {}
