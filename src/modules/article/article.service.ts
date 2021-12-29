import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import { InjectModel } from 'nestjs-typegoose';
import { ArticleModel } from './article.model';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(ArticleModel)
    private readonly categoryModel: ReturnModelType<typeof ArticleModel>,
  ) {}

  async createArticlePost(createArticleInfo: CreateArticleDto): Promise<ArticleModel | undefined> {
    try {
      const newArticlePost = await this.categoryModel.create({
        id: nanoid(24),
        ...createArticleInfo,
        deleteFlag: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newArticlePost;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
