import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICreateArticleDto } from './create-article.interface';

export class CreateArticleDto implements ICreateArticleDto {
  @ApiProperty({
    description: 'The Article Title of the Article Post',
    example: '',
  })
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  articleTitle: string;

  @ApiProperty({
    description: 'The Path of the Article',
  })
  @IsNotEmpty()
  @IsString()
  articlePath: string;

  @ApiProperty({ description: 'The image Path of the Article' })
  @IsNotEmpty()
  @IsString()
  imagePath: string;

  @ApiProperty({ description: 'The author create the Article' })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ description: 'The category of the Article' })
  @IsNotEmpty()
  @IsString()
  category: string[];

  @IsString()
  @IsOptional()
  id_comment: string[];

  @IsOptional()
  deleteFlag: boolean;
}
