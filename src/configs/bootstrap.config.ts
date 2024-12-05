import { existsSync, mkdirSync } from 'fs';
import { APP_CONFIG } from './app.config';

function createFolderByPath(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
}
function initBucket() {
  createFolderByPath(`${APP_CONFIG.ROOT}/_data`);
  createFolderByPath(`${APP_CONFIG.ROOT}/_data/temp`);
  createFolderByPath(`${APP_CONFIG.ROOT}/_data/images`);
  createFolderByPath(`${APP_CONFIG.ROOT}/_data/videos`);
  createFolderByPath(`${APP_CONFIG.ROOT}/_data/audios`);
}

export default function () {
  initBucket();
}
