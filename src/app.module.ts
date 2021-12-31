import { VALIDATION_SCHEMA } from '@config/app.config';
import { ArticleModule } from '@modules/article/article.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SearchModule } from '@modules/search/search.module';
import { UsersModule } from '@modules/users/users.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from '@processors/helper/helper.module';
import { CorsMiddleware } from 'middlewares/cors.middleware';
import { OriginMiddleware } from 'middlewares/origin.middleware';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    ArticleModule,
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
