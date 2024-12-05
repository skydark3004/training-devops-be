import { APP_CONFIG } from 'src/configs/app.config';
import fs from 'fs';

export function deleteFilesInFolder(fileOrListFiles: string[] | string) {
  if (Array.isArray(fileOrListFiles)) {
    for (const pathToFile of fileOrListFiles) {
      fs.unlink(`${APP_CONFIG.ENV.STORAGE.ROOT}/${pathToFile}`, (err) => {
        if (err) console.log(err);
      });
    }
  } else {
    fs.unlink(`${APP_CONFIG.ENV.STORAGE.ROOT}/${fileOrListFiles}`, (err) => {
      if (err) console.log(err);
    });
  }
}
