import * as path from 'path';
import * as dotenv from 'dotenv';
const ROOT = path.normalize(__dirname + '/../..');
dotenv.config({ path: `${ROOT}/.env` });

const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'local',
  VERSION: process.env.VERSION || 'v1',
  NAME: process.env.NAME || 'localhost',
  LOGGING_QUERY_SQL: process.env.LOGGING_QUERY_SQL === 'true', // log query
  PORT: process.env.APP_PORT ? Number(process.env.APP_PORT) : 9999,
  DATABASE: {
    POSTGRESQL: {
      USERNAME: process.env.POSTGRESQL_USERNAME || '',
      PASSWORD: process.env.POSTGRESQL_PASSWORD || '',
      HOST: process.env.POSTGRESQL_HOST || '',
      PORT: Number(process.env.POSTGRESQL_PORT) || 5432,
      NAME: process.env.POSTGRESQL_NAME || '',
    },
  },
  SWAGGER: {
    USERNAME: process.env.SWAGGER_USERNAME || 'admin',
    PASSWORD: process.env.SWAGGER_PASSWORD || 'admin',
  },
  SECURE: {
    JWT: {
      SECRET_KEY: process.env.SECURE_JWT_SECRET_KEY || ``,
      TOKEN_EXPIRE: process.env.SECURE_JWT_TOKEN_EXPIRE ? Number(process.env.SECURE_JWT_TOKEN_EXPIRE) : 24 * 60 * 60 * 30, // 30 days
    },
    SECRET_KEY: process.env.SECURE_SECRET_KEY || ``,
    SECRET_KEY_CLIENT: process.env.SECURE_SECRET_KEY_CLIENT,
    SECRET_KEY_CLIENT_IDS: process.env.SECURE_SECRET_CLIENT_IDS || '',
  },
  STORAGE: {
    DOMAIN: process.env.STORAGE_MEDIA_DOMAIN || '', //  http://localhost:9999/_data
    ROOT: path.join(__dirname, '../../', '_data/upload/storage'),
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
          user: process.env.MAIL_CONFIG_GMAIL_USER || '',
          pass: process.env.MAIL_CONFIG_GMAIL_PASSWORD || '',
        },
      },
    },
    FROM: process.env.MAIL_CONFIG_GMAIL_FROM || '',
  },
  LOG_FOLDER: {
    ROOT: path.join(__dirname, '../../../', '_data/logs'),
  },
  OWNER_EMAIL: process.env.OWNER_EMAIL || 'thangnl.job.3004@gmail.com',
};

export default envConfig;
