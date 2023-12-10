import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AcceptLanguageResolver, I18nModule, I18nService } from 'nestjs-i18n';
import * as path from 'path';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BUSINESS_LAYER_MODULES } from './business-layer';
import { LanguageModel } from './business-layer/i18n/model/language.model';
import { UserProfileResolver } from './business-layer/i18n/resolvers/user-profile.resolver';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required().integer().default(3000),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_HOST: Joi.required(),
        SMS_ENABLED: Joi.boolean().default(false),
        FRONT_URL: Joi.required(),
        AUTH_ACCESS_TOKEN_SECRET: Joi.required(),
        NODE_ENV: Joi.required(),
        DEFAULT_APP_LANGUAGE: Joi.string().default(
          LanguageModel.DEFAULT_LANGUAGE,
        ),
        SWAGGER_ADMIN_PASS: Joi.string().required(),
        SWAGGER_ADMIN_NAME: Joi.string().required(),
        AUTH_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('10d'),
      }),
      envFilePath: `./environments/${process.env.NODE_ENV || ''}.env`,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NEST_SYNCHRONIZE === 'true' ? true : false, // TODO wyłączyć na produkcji
      namingStrategy: new SnakeNamingStrategy(),
      legacySpatialSupport: false,
      extra: {
        connectionLimit: 100,
      },
      charset: 'utf8mb4_unicode_ci',
      logging: process.env.DATABASE_LOGGING === 'true' ? true : false,
    }),

    ...BUSINESS_LAYER_MODULES,
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: process.env.DEFAULT_APP_LANGUAGE
        ? process.env.DEFAULT_APP_LANGUAGE
        : 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
      resolvers: [AcceptLanguageResolver, UserProfileResolver],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: 'public',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService, i18n: I18nService) => ({
        transport: {
          host: config.get('MAILER_HOST'),
          port: config.get('MAILER_PORT'),
          secure: true,
          auth: {
            user: config.get('MAILER_AUTH_USER'),
            pass: config.get('MAILER_AUTH_PASS'),
          },
        },
        defaults: {
          from: config.get('MAILER_SENDER_ADDRESS'),
          attachments: [
            {
              filename: 'logo.png',
              path: process.cwd() + '/public/img/logo.png',
              cid: 'logo',
            },
          ],
        },
        template: {
          dir: path.join(__dirname, './views/emails'),
          adapter: new HandlebarsAdapter({
            // t: i18n.hbsHelper,
            t: (key: string, args: any, options: any) => {
              if (!options) {
                options = args;
              }
              const lang = options?.lookupProperty(
                options?.data?.root,
                'i18nLang',
              );
              return i18n.t(key, {
                lang: lang ?? LanguageModel.DEFAULT_LANGUAGE,
                args: options?.data?.root,
              });
            },
          }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService, I18nService],
    }),

    GlobalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
