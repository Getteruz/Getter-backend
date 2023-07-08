import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll(
    options?: IPaginationOptions,
    where?: FindOptionsWhere<Category>,
  ): Promise<Pagination<Category>> {
    return paginate<Category>(this.categoryRepository, options, {});
  }

  async getById(id: string) {
    const category = await this.categoryRepository.findOne({
      relations: {
        articles: {
          user: true,
        },
      },
      where: { id },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async delete(id: string) {
    const response = await this.categoryRepository.delete(id);
    return response;
  }

  async update(value: UpdateCategoryDto, id: string) {
    const response = await this.categoryRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateCategoryDto) {
    const data = await this.categoryRepository.create(value);
    return await this.categoryRepository.save(data);
  }
}
