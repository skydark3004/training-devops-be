import { existsSync, mkdirSync } from 'fs';
import { APP_CONFIG } from './app.config';

function initBucket() {
  const uploadPath = `${APP_CONFIG.ROOT}/_data`;
  // Create folder if doesn't exist
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath);
  }
}

export default function () {
  initBucket();
}
