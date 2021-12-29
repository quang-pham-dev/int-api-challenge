export interface ICreateArticleDto {
  articleTitle: string;

  articlePath: string;

  imagePath: string;

  author: string;

  category: string[];

  id_comment: string[];

  deleteFlag: boolean;
}
