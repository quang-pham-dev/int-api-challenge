import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './helper.service.email';

const services = [EmailService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class HelperModule {}
