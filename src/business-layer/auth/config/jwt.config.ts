import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: `${process.env.AUTH_ACCESS_TOKEN_SECRET}`,
  global: true,
  signOptions: {
    expiresIn: '10d', // it will be expired after 10 days
  },
};
