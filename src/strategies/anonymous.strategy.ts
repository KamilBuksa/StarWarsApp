import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class PassportAnonymousStrategy extends PassportStrategy(
  Strategy,
  'anonymous',
) {
  constructor() {
    super();
  }

  authenticate() {
    return this.success({});
  }
}
