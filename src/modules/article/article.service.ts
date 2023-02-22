import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdateArticleDto, CreateArticleDto } from './dto';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async getAll() {
    const [data, count] = await this.articleRepository.getAll();
    return { items: data, totalItemsCount: count };
  }

  async getOne(id: string) {
    const data = await this.articleRepository.getById(id);
    if (!data) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.articleRepository.remove(id);
    return response;
  }

  async change(value: UpdateArticleDto, id: string) {
    const response = await this.articleRepository.update(value, id);
    return response;
  }

  async create(value: CreateArticleDto) {
    const response = await this.articleRepository.create(value);
    return response;
  }
}
