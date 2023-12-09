import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CdnModule } from './cdn/cdn.module';
import { LanguageModule } from './language/language.module';
import { MyMailerModule } from './mailer/mailer.module';
import { UsersModule } from './users/users.module';

export const BUSINESS_LAYER_MODULES: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] = [
    AuthModule,
    UsersModule,
    CdnModule,
    MyMailerModule,
    LanguageModule,

  ];
