import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_ACCESS } from '../constants/strategy.constant';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard(STRATEGY_JWT_ACCESS) {}
