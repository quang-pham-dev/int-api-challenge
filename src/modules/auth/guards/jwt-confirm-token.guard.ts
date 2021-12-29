import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_CONFIRM } from '../constants/strategy.constant';

@Injectable()
export class JwtConfirmTokenGuard extends AuthGuard(STRATEGY_JWT_CONFIRM) {}
