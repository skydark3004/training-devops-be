import { APP_CONFIG } from './app.config';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { MyCustomLogger } from './logger-typeorm.config';

export const ormConfig: DataSourceOptions = {
  name: 'default',
  type: 'postgres',
  host: APP_CONFIG.ENV.DATABASE.POSTGRESQL.HOST,
  port: APP_CONFIG.ENV.DATABASE.POSTGRESQL.PORT,
  database: APP_CONFIG.ENV.DATABASE.POSTGRESQL.NAME,
  username: APP_CONFIG.ENV.DATABASE.POSTGRESQL.USERNAME,
  password: APP_CONFIG.ENV.DATABASE.POSTGRESQL.PASSWORD,
  logging: APP_CONFIG.ENV.LOGGING_QUERY_SQL, // log query trong sql,
  logger: 'file', // new MyCustomLogger(),
  synchronize: true,
  entities: [path.join(__dirname, '..') + '/core/entity/*.entity{.ts,.js}'],
  migrations: [path.join(__dirname, '..') + '/core/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
};
