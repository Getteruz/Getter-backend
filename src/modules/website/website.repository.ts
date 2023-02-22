import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { CreateWebsiteDto, UpdateWebsiteDto } from './dto';
import { Website } from './website.entity';

@Injectable()
export class WebsiteRepository {
  constructor(
    @InjectRepository(Website)
    private readonly websiteRepository: Repository<Website>,
  ) {}

  async getAll() {
    return this.websiteRepository.createQueryBuilder().getManyAndCount();
  }

  async getById(id: string): Promise<Website> {
    return this.websiteRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.websiteRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async create(values: CreateWebsiteDto): Promise<InsertResult> {
    return this.websiteRepository
      .createQueryBuilder()
      .insert()
      .into(Website)
      .values(values as unknown as Website)
      .returning('id')
      .execute();
  }

  async update(values: UpdateWebsiteDto, id: string): Promise<UpdateResult> {
    return this.websiteRepository
      .createQueryBuilder()
      .update(Website)
      .set(values as unknown as Website)
      .where('id = :id', { id })
      .execute();
  }
}
