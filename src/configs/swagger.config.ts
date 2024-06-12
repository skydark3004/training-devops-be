import { HttpServer, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { APP_CONFIG } from './app.config';

const api_documentation_credentials = {
  name: APP_CONFIG.ENV.SWAGGER.USERNAME,
  pass: APP_CONFIG.ENV.SWAGGER.PASSWORD,
};

function parseAuthHeader(input: string): { name: string; pass: string } {
  const [, encodedPart] = input.split(' ');

  const buff = Buffer.from(encodedPart, 'base64');
  const text = buff.toString('ascii');
  const [name, pass] = text.split(':');

  return { name, pass };
}

function unauthorizedResponse(httpServer: HttpServer, res: Response): void {
  if (httpServer.getType() === 'fastify') {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic');
  } else {
    res.set('WWW-Authenticate', 'Basic');
    res.status(401).json({ msg: 'Unauthorized' });
  }
}

export function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Men Health API')
    .setDescription('## Men Health API description')
    .setVersion('1.0')
    .addSecurity('token', { type: 'http', scheme: 'bearer' })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const http_adapter = app.getHttpAdapter();
  http_adapter.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return unauthorizedResponse(http_adapter, res);
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (credentials?.name !== api_documentation_credentials.name || credentials?.pass !== api_documentation_credentials.pass) {
      return unauthorizedResponse(http_adapter, res);
    }
    next();
  });

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    //customJs: '/swagger-custom.js',
    customSiteTitle: 'API Documentation',
  });
}
