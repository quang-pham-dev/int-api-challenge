import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleController } from './article.controller';
import { ArticleModel } from './article.model';
import { ArticleService } from './article.service';

@Module({
  imports: [TypegooseModule.forFeature([ArticleModel])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
