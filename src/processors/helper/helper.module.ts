import { UsersModule } from '@modules/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './helper.service.email';

const services = [EmailService];

@Global()
@Module({
  imports: [HttpModule, ConfigModule, JwtModule.register({}), UsersModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
