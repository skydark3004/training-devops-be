import { DataSource } from 'typeorm';
import { ormConfig } from './orm.config';

async function configureMigration() {
  const dataSource = new DataSource(ormConfig);
  return dataSource;
}

export default configureMigration();
