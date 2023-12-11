import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserEntityModule } from '../../data-access-layer/user-entity/user-entity.module';
import { CdnModule } from '../cdn/cdn.module';
import { MyMailerModule } from '../mailer/mailer.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthHelpersService } from './services/auth-helpers.service';
import { AuthService } from './services/auth.service';
import { JWTStrategy } from './services/jwt-strategy.service';
import { PassportLocalStrategy } from './services/passport-local-strategy.service';
import { RegisterUserService } from './services/register-user.service';
import { UserPasswordService } from './services/user-password.service';

@Module({
  imports: [
    PassportModule,
    UserEntityModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('AUTH_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>(
              'AUTH_ACCESS_TOKEN_EXPIRES_IN',
            ),
          },
        };
      },
    }),
    UsersModule,
    CdnModule,
    MyMailerModule,
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    PassportLocalStrategy,
    JWTStrategy,
    RegisterUserService,
    AuthHelpersService,
    UserPasswordService,
  ],
  exports: [AuthHelpersService],
})
export class AuthModule {}
