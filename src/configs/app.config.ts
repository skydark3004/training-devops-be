import * as path from 'path';
import envConfig from './env.config';

export const APP_CONFIG = {
  ROOT: path.normalize(__dirname + '/../..'),
  ENV: envConfig,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOP: process.env.NODE_ENV === 'develop',
  IS_STAGING: process.env.NODE_ENV === 'staging',
  IS_TESTING: process.env.NODE_ENV === 'test',
  IS_LOCAL: process.env.NODE_ENV === 'local',
  IS_WINDOW_OS: process.platform === 'win32',
  IS_LINUX_OS: process.platform === 'linux',
};
