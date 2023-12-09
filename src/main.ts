import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { I18nValidationPipe } from 'nestjs-i18n';
import * as path from 'path';
import { join } from 'path';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { HttpExceptionFilter } from './utils/i18n-http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { apiPrefix } from './utils/routes-prefix';
import { CdnUtils } from './business-layer/cdn/cdn-utils';

async function bootstrap(): Promise<void> {
  const dirPath = path.join(__dirname, '../upload');

  if (!(await CdnUtils.checkFileExists(dirPath))) {
    await CdnUtils.createDirectory(dirPath);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(apiPrefix);
  initSwagger(app, {
    name: configService.get('SWAGGER_ADMIN_NAME'),
    pass: configService.get('SWAGGER_ADMIN_PASS'),
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: `/${apiPrefix}/public`,
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(helmet());

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));

  const port: number = process.env.APP_PORT ? +process.env.APP_PORT : 3000;
  await app.listen(port);
  console.log(`App launched on port ${port}`);
}

bootstrap();
