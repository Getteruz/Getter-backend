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
        user: {
          avatar: true,
          position: true,
        },
        avatar: true,
      },
      where,
    });
  }

  async getOne(id: string, cookie?) {
    const article = await this.articleRepository.findOne({
      relations: {
        user: {
          avatar: true,
          position: true,
        },
        comments: {
          user: {
            avatar: true,
            position: true,
          },
          repliedComments: {
            user: {
              avatar: true,
            },
          },
        },
        avatar: true,
        likes: true,
        category: true,
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

  async getByCategoryId(id: string) {
    const articles = await this.articleRepository.find({
      relations: {
        user: {
          avatar: true,
          position: true,
        },
        avatar: true,
      },
      where: {
        category: { id },
        isActive: true,
      },
    });

    return articles;
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
    req,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, req);
      values.avatar = avatar;
    }

    const response = await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set(values as unknown as Article)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async changeIsActive(isActive: boolean, id: string) {
    const data = await this.articleRepository.update(id, { isActive });
    return data;
  }

  async create(values: CreateArticleDto, file: Express.Multer.File, request) {
    if (file) {
      const avatar = await this.uploadImage(file, request);
      values.avatar = avatar.id;
    }
    const response = await this.articleRepository
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values(values as unknown as Article)
      .returning('id')
      .execute();

    return response;
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

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getById(id);
    let avatar;
    if (data?.avatar?.id) {
      avatar = await this.fileService.updateFile(data.avatar.id, file, request);
    } else {
      avatar = await this.fileService.uploadFile(file, request);
    }

    return avatar;
  }

  async deleteImage(id: string) {
    const data = await this.getById(id);
    if (data?.avatar?.id) {
      await this.fileService.removeFile(data.avatar.id);
    }
  }
}
