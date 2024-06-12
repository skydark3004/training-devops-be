import { Global, Module } from '@nestjs/common';

import * as repositories from './repository';
import { DatabaseModule } from 'src/module-database/database.module';

const PROVIDERS_AND_EXPORTS = Object.values(repositories);

@Global()
@Module({
  imports: [DatabaseModule],
  providers: PROVIDERS_AND_EXPORTS,
  exports: PROVIDERS_AND_EXPORTS,
})
export class RepositoryModuleGlobal {}
