import { JWT_VERIFICATION_TOKEN_SECRET } from '@constants/jwt.constant';
import { HttpUnauthorizedError } from '@errors/unauthorized.error';
import { User } from '@modules/users/models/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import logger from '@utils/logger';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { STRATEGY_JWT_CONFIRM } from '../constants/strategy.constant';
import { IEmailConfirmPayload } from '../interfaces/emailConfirm-payload.interface';

@Injectable()
export class JwtConfirmTokenStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_CONFIRM) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_VERIFICATION_TOKEN_SECRET),
      ignoreExpiration: false,
    });
  }

  async validate(payload: IEmailConfirmPayload): Promise<User> {
    logger.info(`${this.validate.name} was called`);
    const user = await this.authService.verifyEmailPayload(payload);
    if (user) {
      if (user.isEmailConfirmed) {
        throw new BadRequestException('Email already confirmed');
      }
      return user;
    }
    throw new HttpUnauthorizedError();
  }
}
