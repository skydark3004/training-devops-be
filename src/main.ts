import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { APP_CONFIG } from './configs/app.config';
import nestConfig from './configs/nest.config';
import bootstrapConfig from './configs/bootstrap.config';
import { configSwagger } from './configs/swagger.config';

const logger: Logger = new Logger('Main');
const port = APP_CONFIG.ENV.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  nestConfig(app);
  bootstrapConfig();
  configSwagger(app);

  await app.listen(port, () => {
    logger.log(`Application listening on port ${port} or http://localhost:${port}`);
    logger.log(`URL API is http://localhost:${port}/api/v1/`);
    logger.log(`URL Swagger: http://localhost:${port}/api-docs`);
    logger.log(`Account of Swagger: admin/admin`);
  });
}

bootstrap();
