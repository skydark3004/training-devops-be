import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthModuleGlobal } from './authenticate/jwt.module';
import { ModulesApi } from './module-api/index.module';
import { ModulesGlobal } from './module-global/index.module';
import { AddDataToHeaderInterceptor } from './interceptors';
import { RepositoryModuleGlobal } from './module-repository/repository.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_CONFIG } from './configs/app.config';
import { CurlLoggerMiddleware } from './middleware/curl-logger.middleware';

const providers: any = [AppService, { provide: APP_INTERCEPTOR, useClass: AddDataToHeaderInterceptor }];

if (!APP_CONFIG.IS_LOCAL) {
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: ErrorInterceptor,
  });
}

const imports: any[] = [JwtAuthModuleGlobal, ModulesGlobal, ModulesApi, RepositoryModuleGlobal];

if (APP_CONFIG.IS_LOCAL) {
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '_data'),
    }),
  );
}

@Module({
  imports: imports,
  controllers: [AppController],
  providers: providers,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (!APP_CONFIG.IS_LOCAL) {
      consumer.apply(CurlLoggerMiddleware).forRoutes('*'); // Áp dụng cho tất cả các routes
    }
  }
}
