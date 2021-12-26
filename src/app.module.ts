import { VALIDATION_SCHEMA } from '@config/app.config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@processors/cache/cache.module';
import { DatabaseModule } from '@processors/database/database.module';
import { HelperModule } from '@processors/helper/helper.module';
import { CorsMiddleware } from 'middlewares/cors.middleware';
import { OriginMiddleware } from 'middlewares/origin.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    //#Redis Configuration
    //#Configuration
    ConfigModule.forRoot(VALIDATION_SCHEMA),
    DatabaseModule,
    HelperModule,
    // CacheModule,
    //#Feature modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
