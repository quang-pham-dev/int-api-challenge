import { HttpUnauthorizedError } from '@errors/unauthorized.error';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import logger from '@utils/logger';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { STRATEGY_JWT_ACCESS } from './constants/strategy.constant';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_ACCESS) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    logger.info(`${this.validate.name} was called`);
    const user = await this.authService.verifyPayload(payload);
    if (user) {
      return user;
    }
    throw new HttpUnauthorizedError();
  }
}
