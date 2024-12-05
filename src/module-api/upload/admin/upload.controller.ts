import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadServiceAdmin } from './upload.service';
import { configMulter } from 'src/configs/multer.config';
@Controller('/admin/upload')
export class UploadControllerAdmin {
  constructor(private uploadServiceAdmin: UploadServiceAdmin) {}

  @Post('/image')
  @UseInterceptors(FileInterceptor('file', configMulter({ fileType: 'IMAGE' })))
  async uploadBanner(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadServiceAdmin.uploadFile(file, 'images');
    return response;
  }

  @Post('/video')
  @UseInterceptors(FileInterceptor('file', configMulter({ fileType: 'VIDEO' })))
  async uploadVideo(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadServiceAdmin.uploadFile(file, 'videos');
    return response;
  }

  @Post('/audio')
  @UseInterceptors(FileInterceptor('file', configMulter({ fileType: 'AUDIO' })))
  async uploadAudio(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadServiceAdmin.uploadFile(file, 'audios');
    return response;
  }

  /*   @Post('/chunk')
  @UseInterceptors(FileInterceptor('file', configMulter({ fileType: 'IMAGE' })))
  async uploadChunk(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadServiceAdmin.uploadFile(body, file);
    return response;
  } */
}
