import { APP_CONFIG } from '../configs/app.config';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StringUtil } from '../libs/utils';
//import { storageEngine } from 'multer-cloud-storage';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const configMulter = (config?: {
  storage: {
    isLocal?: boolean;
    isCloudStorage?: boolean;
  };
}): MulterOptions => {
  const multerOptions: MulterOptions = {
    /*     limits: {
      fileSize: 1048576 * 2, // bytes
    }, */
    fileFilter: (req: any, file: any, cb: any) => {
      if (!file) {
        cb(new HttpException(`Không có file}`, HttpStatus.BAD_REQUEST), false);
      }

      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|)$/)) {
        return cb(null, true);
      } else {
        cb(new HttpException(`Không hỗ trợ file có định dạng ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
    },
    storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
        if (!existsSync(`${APP_CONFIG.ROOT}/_data/upload/`)) {
          mkdirSync(`${APP_CONFIG.ROOT}/_data/upload/`);
          if (!existsSync(`${APP_CONFIG.ROOT}/_data/upload/storage/`)) {
            mkdirSync(`${APP_CONFIG.ROOT}/_data/upload/storage/`);
          }
        }
        cb(null, APP_CONFIG.ENV.STORAGE.ROOT);
      },
      filename: (req: any, file: any, cb: any) => {
        return cb(null, `${StringUtil.genRandomString(20)}.png`);
      },
    }),
  };

  if (config?.storage?.isCloudStorage) {
    delete multerOptions.storage;
  }

  // use multer-cloud-storage
  /*   if (config?.storage) {
    multerOptions.storage = storageEngine({
      projectId: 'dogwood-vision-396115',
      keyFilename: `./keys-upload.json`,
      bucket: 'test-bucket-3004',
      destination: config.storage.folderBucket,
      filename: `${StringUtil.genRandomString(20)}.png`,
      acl: 'publicRead',
    });
  } */
  return multerOptions;
};
