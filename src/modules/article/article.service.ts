import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdateArticleDto, CreateArticleDto } from './dto';
import { ArticleRepository } from './article.repository';
import { FileService } from '../file/file.service';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
  ) {}

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
    await this.deleteImage(id);
    const response = await this.articleRepository.remove(id);
    return response;
  }

  async change(value: UpdateArticleDto, id: string, file: Express.Multer.File) {
    const response = await this.articleRepository.update(value, id);
    if (file) {
      return await this.updateImage(file, id);
    } else {
      return response;
    }
  }

  async create(value: CreateArticleDto, file: Express.Multer.File) {
    const response = await this.articleRepository.create(value);
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
