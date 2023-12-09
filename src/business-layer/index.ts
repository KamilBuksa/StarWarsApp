import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CdnModule } from './cdn/cdn.module';
import { LanguageModule } from './language/language.module';
import { MyMailerModule } from './mailer/mailer.module';
import { UsersModule } from './users/users.module';
import { StarWarsModule } from './star-wars/star-wars.module';

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
    StarWarsModule,
  ];
