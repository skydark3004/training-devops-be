import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_CONFIG } from 'src/configs/app.config';
import { ormConfig } from 'src/configs/orm.config';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';

const logNestJS: Logger = new Logger('TypeORM Connection');

export const databaseProviders = {
  provide: ProvideOfProvidersEnum.DATA_SOURCE,
  useFactory: async () => {
    try {
      //await createDatabase({ ifNotExist: true, options: ormConfig });
      const dataSource = new DataSource(ormConfig);
      await dataSource.initialize();
      logNestJS.log(`Connected PostgreSQL successfully!`);
      return dataSource;
    } catch (error) {
      logNestJS.error(`Connected PostgreSQL error`, error);
    }
  },
};

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig)],
  providers: [databaseProviders],
  exports: [databaseProviders],
})
export class DatabaseModule {}
