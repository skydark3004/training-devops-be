import { APP_CONFIG } from '../configs/app.config';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { StringUtil } from '../libs/utils';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';

interface IFile {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
}

export const configMulter = (config: { fileType: 'IMAGE' | 'VIDEO' | 'AUDIO' }): MulterOptions => {
  const multerOptions: MulterOptions = {
    /*     limits: {
      fileSize: 1048576 * 2, // bytes
    }, */
    fileFilter: (req: Request, file: IFile, callback: (error: Error | null, acceptFile: boolean) => void): void => {
      return CONFIG_FILE[config?.fileType].fileFilter(file, callback);
    },
    storage: diskStorage({
      destination: (req: Request, file: IFile, callback: (error: Error | null, destination: string) => void) => {
        return CONFIG_FILE[config?.fileType].destination(callback);
      },
      filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void): void => {
        const prefix = req.headers['prefix'];
        if (!prefix) {
          return callback(new BadRequestException('Không có prefix'), 'prefix');
        }
        return CONFIG_FILE[config?.fileType].filename(file, callback, Array.isArray(prefix) ? prefix[0] : prefix);
      },
    }),
  };

  return multerOptions;
};

const CONFIG_FILE = {
  IMAGE: {
    fileFilter: (file: IFile, callback: (error: Error | null, acceptFile: boolean) => void) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|)$/)) {
        return callback(new BadRequestException(`Không hỗ trợ file có định dạng ${extname(file.originalname)}`), false);
      }
      return callback(null, true);
    },
    filename: (file: IFile, callback: (error: Error | null, filename: string) => void, prefix?: string): void => {
      const timestamp = Date.now();
      const prefixName = prefix ? `${prefix}_` : '';
      const finalName = `${prefixName}${timestamp}_${StringUtil.genRandomString(5)}.png`;
      return callback(null, finalName);
    },
    destination: (callback: (error: Error | null, destination: string) => void) => {
      return callback(null, APP_CONFIG.ENV.STORAGE.IMAGE);
    },
  },
  VIDEO: {
    fileFilter: (file: IFile, callback: (error: Error | null, acceptFile: boolean) => void) => {
      if (!file.mimetype.match(/\/(mkv|mp4|avi|)$/)) {
        return callback(new BadRequestException(`Không hỗ trợ file có định dạng ${extname(file.originalname)}`), false);
      }

      return callback(null, true);
    },
    filename: (file: IFile, callback: (error: Error | null, filename: string) => void, prefix?: string): void => {
      const timestamp = Date.now();
      const prefixName = prefix ? `${prefix}_` : '';
      const finalName = `${prefixName}${timestamp}_${StringUtil.genRandomString(5)}.mp4`;
      return callback(null, finalName);
    },
    destination: (callback: (error: Error | null, destination: string) => void) => {
      return callback(null, APP_CONFIG.ENV.STORAGE.VIDEO);
    },
  },
  AUDIO: {
    fileFilter: (file: IFile, callback: (error: Error | null, acceptFile: boolean) => void) => {
      console.log(file);
      if (file.mimetype !== 'audio/mpeg') {
        return callback(new BadRequestException(`Không hỗ trợ file có định dạng ${extname(file.originalname)}`), false);
      }

      return callback(null, true);
    },
    filename: (file: IFile, callback: (error: Error | null, filename: string) => void, prefix?: string): void => {
      const timestamp = Date.now();
      const prefixName = prefix ? `${prefix}_` : '';
      const finalName = `${prefixName}${timestamp}_${StringUtil.genRandomString(5)}.mp3`;
      return callback(null, finalName);
    },
    destination: (callback: (error: Error | null, destination: string) => void) => {
      return callback(null, APP_CONFIG.ENV.STORAGE.AUDIO);
    },
  },
};
