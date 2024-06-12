import * as fs from 'fs';
import { StringUtil } from './string.util';
import { APP_CONFIG } from '../../configs/app.config';
import { BadRequestException } from '@nestjs/common';
import { AxiosInstance } from './axios.util';

export async function convertUrlToImage(url: string, fileName: string) {
  const axios = new AxiosInstance(url, { responseType: 'arraybuffer' });
  isImgLink(url);
  const pathUpload = APP_CONFIG.ENV.STORAGE.ROOT;
  !fs.existsSync(pathUpload) && fs.mkdirSync(pathUpload, { recursive: true });
  const path = `${fileName}.png`;
  const image = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(`${pathUpload}/${path}`, image);
  return path;
}

export function convertBase64ToImage(base64: string) {
  const pathUpload = APP_CONFIG.ENV.STORAGE.ROOT;
  !fs.existsSync(pathUpload) && fs.mkdirSync(pathUpload, { recursive: true });
  const buffer = Buffer.from(base64, 'base64');
  const path = `${StringUtil.genRandomString(20)}.png`;
  fs.writeFileSync(`${pathUpload}/${path}`, buffer);
  return path;
}

export function isImgLink(url: string) {
  const match = url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null;
  if (!match) throw new BadRequestException('URL không hợp lệ (không phải ảnh)');
  return true;
}
