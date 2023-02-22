import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdateWebsiteDto, CreateWebsiteDto } from './dto';
import { WebsiteRepository } from './website.repository';

@Injectable()
export class WebsiteService {
  constructor(private readonly websiteRepository: WebsiteRepository) {}

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
    const response = await this.websiteRepository.remove(id);
    return response;
  }

  async change(value: UpdateWebsiteDto, id: string) {
    const response = await this.websiteRepository.update(value, id);
    return response;
  }

  async create(value: CreateWebsiteDto) {
    const response = await this.websiteRepository.create(value);
    return response;
  }
}
