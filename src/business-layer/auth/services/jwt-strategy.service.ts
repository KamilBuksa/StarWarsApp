import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../config/jwt.config';

export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_ACCESS_TOKEN_SECRET || jwtConfig.secret,
    });
  }

  /**
   * Strategy (jwt-strategy) decrypt token and return payload to this function
   * so it can be manipulated in a way we want it. Returned value is provided to @Request() req.user property
   */
  validate(payload: { token_data: any }): any {
    return payload.token_data;
  }
}
