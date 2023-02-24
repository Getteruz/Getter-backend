import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { CreateArticleDto, UpdateArticleDto } from './dto';
import { Article } from './article.entity';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async getAll() {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.comments', 'comment')
      .leftJoinAndSelect('article.user', 'user')
      .getManyAndCount();
  }

  async getById(id: string): Promise<Article> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .leftJoinAndSelect('article.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .getOne();
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.articleRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async create(values: CreateArticleDto): Promise<InsertResult> {
    return this.articleRepository
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values(values as unknown as Article)
      .returning('id')
      .execute();
  }

  async update(values: UpdateArticleDto, id: string): Promise<UpdateResult> {
    return this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set(values as unknown as Article)
      .where('id = :id', { id })
      .execute();
  }
}
