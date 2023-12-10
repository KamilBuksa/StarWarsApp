import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { apiPrefix } from './utils/routes-prefix';

export const initSwagger = (
  app: INestApplication,
  admin: { name: string; pass: string },
) => {
  // if you are using setGlobalPrefix -> use it before initSwagger()


  const swaggerUrls = [
    `/${apiPrefix}/doc-json`,
    `/${apiPrefix}/doc`,
  ];

  swaggerUrls.forEach((url) => {
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.use(url, (req, res, next) => {
      function parseAuthHeader(input: string): { name: string; pass: string } {
        const [, encodedPart] = input.split(' ');
        const buff = Buffer.from(encodedPart, 'base64');
        const text = buff.toString('ascii');
        const [name, pass] = text.split(':');
        return { name, pass };
      }
      function unauthorizedResponse(): void {
        if (httpAdapter.getType() === 'fastify') {
          res.statusCode = 401;
          res.setHeader('WWW-Authenticate', 'Basic');
        } else {
          res.status(401);
          res.set('WWW-Authenticate', 'Basic');
        }
        next();
      }
      if (!req.headers.authorization) {
        return unauthorizedResponse();
      }
      const credentials = parseAuthHeader(req.headers.authorization);
      if (
        credentials?.name !== admin?.name ||
        credentials?.pass !== admin?.pass
      ) {
        return unauthorizedResponse();
      }
      next();
    });
  }
  );



  const config = new DocumentBuilder()
    .setTitle('Galactic Pioneers_ex ')
    .setDescription('The Galactic Pioneers_ex API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup(`${apiPrefix}/doc`, app, document, {
    swaggerOptions: {
      // tagsSorter: 'alpha',
      // operationsSorter: 'alpha',
      filter: true,
      // docExpansion: "list"
    },
  });
};
