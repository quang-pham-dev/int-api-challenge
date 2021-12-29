import { IBaseModel } from '@interfaces/base-model.interface';
import { DocumentType, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { IArticle } from './article-model.interface';

export type ArticleDocument = DocumentType<ArticleModel>;

@modelOptions({ options: { customName: 'Article', allowMixed: Severity.ALLOW } })
export class ArticleModel implements IArticle, IBaseModel {
  @prop({ unique: true })
  id: string;

  @prop()
  articleTitle: string;

  @prop()
  articlePath: string;

  @prop()
  imagePath: string;

  @prop()
  author: string;

  @prop()
  category: string[];

  @prop()
  id_comment: string[];

  @prop({ default: false })
  deleteFlag: boolean;

  @prop({ default: Date })
  createdAt: Date;

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ default: Date })
  deletedAt: Date;
}
