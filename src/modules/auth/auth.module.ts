import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './jwt-access-token.strategy';
import { JwtConfirmTokenStrategy } from './jwt-confirm-token.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [ConfigModule, UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, JwtConfirmTokenStrategy, JwtAccessTokenStrategy, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
