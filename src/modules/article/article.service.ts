import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { UpdateArticleDto, CreateArticleDto } from './dto';
import { ArticleRepository } from './article.repository';
import { FileService } from '../file/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: ArticleRepository,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Article>,
  ): Promise<Pagination<Article>> {
    return paginate<Article>(this.articleRepository, options, {
      order: {
        title: 'ASC',
      },
      relations: {
        user: true,
        avatar: true,
      },
    });
  }

  async getOne(id: string) {
    const article = await this.articleRepository.findOne({
      relations: {
        user: true,
        comments: {
          user: true,
        },
        avatar: true,
      },
      where: { id },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.articleRepository.delete(id);
    return response;
  }

  async change(
    values: UpdateArticleDto,
    id: string,
    file: Express.Multer.File,
  ) {
    const response = await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set(values as unknown as Article)
      .where('id = :id', { id })
      .execute();

    if (file) {
      return await this.updateImage(file, id);
    } else {
      return response;
    }
  }

  async create(values: CreateArticleDto, file: Express.Multer.File) {
    const response = await this.articleRepository
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values(values as unknown as Article)
      .returning('id')
      .execute();

    const id = response.raw[0].id;

    if (file) {
      return await this.uploadImage(file, id);
    } else {
      return response;
    }
  }

  async uploadImage(file: Express.Multer.File, id: string) {
    const avatar = await this.fileService.uploadFile(file);
    const data = await this.getOne(id);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async updateImage(file: Express.Multer.File, id: string) {
    const data = await this.getOne(id);
    const avatar = await this.fileService.updateFile(data.avatar.id, file);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async deleteImage(id: string) {
    const data = await this.getOne(id);
    const deletedAvatar = await this.fileService.removeFile(data.avatar.id);
  }
}
