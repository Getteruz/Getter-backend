import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateArticleDto, CreateArticleDto, LikeArticleDto } from './dto';
import { ArticleRepository } from './article.repository';
import { FileService } from '../file/file.service';
import { Article } from './article.entity';
import { UsersService } from '../user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: ArticleRepository,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
    private readonly userService: UsersService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where,
  ): Promise<Pagination<Article>> {
    return paginate<Article>(this.articleRepository, options, {
      order: {
        date: 'DESC',
      },
      relations: {
        user: true,
        avatar: true,
      },
      where,
    });
  }

  async getOne(id: string, cookie?) {
    const article = await this.articleRepository.findOne({
      relations: {
        user: true,
        comments: {
          user: true,
        },
        avatar: true,
        likes: true,
      },
      where: { id },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    if (cookie.user_id) {
      const isLiked = article.likes.find((u) => u.id == cookie.user_id);
      if (isLiked) {
        return { data: { ...article, isLiked: true } };
      } else {
        return { data: { ...article, isLiked: false } };
      }
    }

    return { data: { ...article, isLiked: false } };
  }

  async getById(id: string) {
    const article = await this.articleRepository.findOne({
      relations: {
        user: true,
        comments: {
          user: true,
        },
        avatar: true,
        likes: true,
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
    request
  ) {
    const response = await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set(values as unknown as Article)
      .where('id = :id', { id })
      .execute();

    if (file) {
      return await this.updateImage(file, id,request);
    } else {
      return response;
    }
  }

  async create(values: CreateArticleDto, file: Express.Multer.File,request) {
    const response = await this.articleRepository
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values(values as unknown as Article)
      .returning('id')
      .execute();

    const id = response.raw[0].id;

    if (file) {
      return await this.uploadImage(file, id,request);
    } else {
      return response;
    }
  }

  async addLikeToArticle(values: LikeArticleDto) {
    const article = await this.getById(values.articleId);
    const user = await this.userService.getById(values.userId);

    article.likes = article.likes || [];
    article.likes.push(user);
    article.likesCount = article.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(article);
    });
    return article;
  }

  async removeLikeFromArticle(values: LikeArticleDto) {
    const article = await this.getById(values.articleId);

    article.likes = article.likes || [];
    article.likes = article.likes.filter((u) => u.id != values.userId);
    article.likesCount = article.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(article);
    });
    return article;
  }

  async uploadImage(file: Express.Multer.File, id: string,request) {
    const avatar = await this.fileService.uploadFile(file,request);
    const data = await this.getById(id);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async updateImage(file: Express.Multer.File, id: string,request) {
    const data = await this.getById(id);
    const avatar = await this.fileService.updateFile(data.avatar.id, file,request);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async deleteImage(id: string) {
    const data = await this.getById(id);
    const deletedAvatar = await this.fileService.removeFile(data.avatar.id);
  }
}
