import { INestApplication, RequestMethod } from '@nestjs/common';
import { APP_CONFIG } from './app.config';
export default function routerConfig(app: INestApplication) {
  app.setGlobalPrefix(`api/${APP_CONFIG.ENV.VERSION}`, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
}
