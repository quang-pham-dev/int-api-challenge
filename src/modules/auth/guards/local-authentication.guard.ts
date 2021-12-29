import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_LOCAL } from '../constants/strategy.constant';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard(STRATEGY_LOCAL) {}
