import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { FileService } from '../file/file.service';

import { UpdateWebsiteDto, CreateWebsiteDto } from './dto';
import { WebsiteRepository } from './website.repository';

@Injectable()
export class WebsiteService {
  constructor(
    private readonly websiteRepository: WebsiteRepository,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
  ) {}

  async getAll() {
    const [data, count] = await this.websiteRepository.getAll();
    return { items: data, totalItemsCount: count };
  }

  async getOne(id: string) {
    const data = await this.websiteRepository.getById(id);
    if (!data) {
      throw new HttpException('Website not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.websiteRepository.remove(id);
    return response;
  }

  async change(value: UpdateWebsiteDto, id: string) {
    const response = await this.websiteRepository.update(value, id);
    return response;
  }

  async create(value: CreateWebsiteDto) {
    const response = await this.websiteRepository.create(value);
    const id = response.raw[0].id;
    return await this.uploadScreenShotImage(value.link, value.title, id);
  }

  async uploadScreenShotImage(link: string, title: string, id: string) {
    const avatar = await this.fileService.uploadScreenshotWebsite(link, title);
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
