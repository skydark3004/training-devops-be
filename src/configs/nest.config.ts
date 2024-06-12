import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { json, urlencoded } from 'express';

import compression from 'compression';
import morgan from 'morgan';
import { APP_CONFIG } from './app.config';

export default function (app: INestApplication) {
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    maxAge: 86400,
  });
  app.use(bodyParser.json());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // https://github.com/nestjs/nest/issues/3842
    }),
  );
  app.use(json({ limit: '50mb' }));
  APP_CONFIG.IS_LOCAL && app.use(morgan('dev'));
  app.use(compression());
  app.use(urlencoded({ extended: true, limit: '50mb' }));
}
