import { JWT_REFRESH_TOKEN_SECRET } from '@constants/jwt.constant';
import { UsersService } from '@modules/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import logger from '@utils/logger';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_REFRESH } from '../constants/strategy.constant';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_REFRESH) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request.headers?.authorization?.replace('Bearer ', '');
          console.log(refreshToken);
          return refreshToken;
        },
      ]),
      secretOrKey: configService.get<string>(JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: IJwtPayload) {
    logger.info(`${this.validate.name} jwt-refresh was called`);
    const refreshToken = req.headers?.authorization?.replace('Bearer ', '').trim();
    console.log(refreshToken);
    if (payload.id && refreshToken) {
      return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.id);
    }
    throw new BadRequestException(
      `Bad request please check: refreshToken is ${refreshToken} or id is ${payload.id}`,
    );
  }
}
