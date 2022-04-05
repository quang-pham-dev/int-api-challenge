import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypegooseModule } from 'nestjs-typegoose';

import { VALIDATION_SCHEMA } from '@config/app.config';
import { AuthModule } from '@modules/auth/auth.module';
import { GoalsModule } from '@modules/goals/goals.module';
import { SearchModule } from '@modules/search/search.module';
import { UsersModule } from '@modules/users/users.module';
import { HelperModule } from '@processors/helper/helper.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CorsMiddleware } from 'middleware/cors.middleware';
import { OriginMiddleware } from 'middleware/origin.middleware';

@Module({
  imports: [
    //#Redis Configuration
    //#Configuration
    ConfigModule.forRoot(VALIDATION_SCHEMA),
    TypegooseModule.forRoot(process.env.DB_HOST),
    // DatabaseModule,
    HelperModule,
    //#Feature modules
    AuthModule,
    UsersModule,
    GoalsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
