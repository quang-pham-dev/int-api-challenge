import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_REFRESH } from '../constants/strategy.constant';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(STRATEGY_JWT_REFRESH) {}
