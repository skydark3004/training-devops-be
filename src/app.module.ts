import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthModuleGlobal } from './authenticate/jwt.module';
import { ModulesApi } from './module-api/index.module';

import { ModulesGlobal } from './module-global/index.module';

import { AddDataToHeaderInterceptor } from './interceptors';
import { RepositoryModuleGlobal } from './module-repository/repository.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';

const providers: any = [
  AppService,
  { provide: APP_INTERCEPTOR, useClass: AddDataToHeaderInterceptor },
  {
    provide: APP_INTERCEPTOR,
    useClass: ErrorInterceptor,
  },
];

@Module({
  imports: [JwtAuthModuleGlobal, ModulesGlobal, ModulesApi, RepositoryModuleGlobal],
  controllers: [AppController],
  providers: providers,
})
export class AppModule {}
