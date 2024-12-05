import * as path from 'path';
import * as dotenv from 'dotenv';
const ROOT = path.normalize(__dirname + '/../..');
dotenv.config({ path: `${ROOT}/.env` });

const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'local',
  NAME: process.env.NAME || 'localhost',
  VERSION: process.env.VERSION || 'v1',
  LOGGING_QUERY_SQL: process.env.LOGGING_QUERY_SQL === 'true', // log query
  PORT: process.env.APP_PORT ? Number(process.env.APP_PORT) : 9999,
  DATABASE: {
    POSTGRESQL: {
      USERNAME: process.env.POSTGRESQL_USERNAME || 'postgres',
      PASSWORD: process.env.POSTGRESQL_PASSWORD || 'postgres',
      HOST: process.env.POSTGRESQL_HOST || 'localhost',
      PORT: Number(process.env.POSTGRESQL_PORT) || 5432,
      NAME: process.env.POSTGRESQL_NAME || 'men-health',
    },
  },
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    PASSWORD: process.env.REDIS_PASSWORD || 'redis-password-local',
  },
  SECURE: {
    JWT: {
      SECRET_KEY: process.env.SECURE_JWT_SECRET_KEY || `core-devjwtauthenticate-core.dev_professional#2024`,
      TOKEN_EXPIRE: process.env.SECURE_JWT_TOKEN_EXPIRE ? Number(process.env.SECURE_JWT_TOKEN_EXPIRE) : 24 * 60 * 60 * 30, // 30 days
    },
    SECRET_KEY: process.env.SECURE_SECRET_KEY || `f54cbce96307efc3367641177acc7cf8`,
    SECRET_KEY_CLIENT: process.env.SECURE_SECRET_KEY_CLIENT,
    SECRET_KEY_CLIENT_IDS: process.env.SECURE_SECRET_CLIENT_IDS || 'f54cbce96307efc52353k45435n2k34423j4324hkl4234n324',
  },
  STORAGE: {
    DOMAIN: process.env.STORAGE_MEDIA_DOMAIN || 'http://localhost:9999', //  http://localhost:9999/_data
    ROOT: path.join(__dirname, '../../', '_data'),
    TEMP: path.join(__dirname, '../../', '_data/temp'),
    IMAGE: path.join(__dirname, '../../', '_data/images'),
    VIDEO: path.join(__dirname, '../../', '_data/videos'),
    AUDIO: path.join(__dirname, '../../', '_data/audios'),
  },
  MAIL_CONFIG: {
    ON_PREMISE: {
      SMTP_CONFIG: {
        service: process.env.MAIL_CONFIG_SMTP_SERVICE || '',
        host: process.env.MAIL_CONFIG_SMTP_HOST || '',
        port: Number(process.env.MAIL_CONFIG_SMTP_PORT) || 587,
        auth: {
          user: process.env.MAIL_CONFIG_SMTP_USER || '',
          pass: process.env.MAIL_CONFIG_SMTP_PASS || '',
        },
      },
      WEB_URL: process.env.MAIL_CONFIG_SMTP_WEB_URL || '',
    },
    GMAIL: {
      CONFIG: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 587, false for other ports
        requireTLS: true,
        auth: {
          user: process.env.MAIL_CONFIG_GMAIL_USER || 'bots0000002@gmail.com',
          pass: process.env.MAIL_CONFIG_GMAIL_PASSWORD || 'hunfmguzgfkniwhe',
        },
      },
    },
    FROM: process.env.MAIL_CONFIG_GMAIL_FROM || '',
  },
  LOG_FOLDER: {
    ROOT: path.join(__dirname, '../../../', '_data/logs'),
  },
  OWNER_EMAIL: process.env.OWNER_EMAIL || 'thangnl.job.3004@gmail.com',
  VIETQR: {
    USERNAME: process.env.VIETQR_USERNAME || 'onlytestvietqr@gmail.com',
    PASSWORD: process.env.VIETQR_PASSWORD || 'onlytestvietqr123',
    SECRET_KEY: process.env.VIETQR_SECRET_KEY || `secretkey-viet-qr123@12345@2024`,
    BASE_URL: process.env.VIETQR_BASE_URL || 'https://dev.vietqr.org',
    USERNAME_TO_GET_ACCESS_TOKEN: process.env.VIETQR_USER_USERNAME_TO_GET_ACCESS_TOKEN,
    PASSWORD_TO_GET_ACCESS_TOKEN: process.env.VIETQR_PASSWORD_TO_GET_ACCESS_TOKEN,
    BANK_ACCOUNT: process.env.VIETQR_BANK_ACCOUNT,
    BANK_CODE: process.env.VIETQR_BANK_CODE,
    USER_BANK_NAME: process.env.VIETQR_USER_BANK_NAME,
  },
  GOOGLE_SHEET: {
    CLIENT_EMAIL: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    PRIVATE_KEY: process.env.GOOGLE_SHEET_PRIVATE_KEY,
  },
};

export default envConfig;
