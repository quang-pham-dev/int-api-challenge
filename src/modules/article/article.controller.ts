import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './create-article.dto';

@Controller('article')
@ApiTags('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createArticlePost(@Body() createArticleInfo: CreateArticleDto) {
    const createdArticlePost = await this.articleService.createArticlePost(createArticleInfo);
    return { createdArticlePost };
  }
}
