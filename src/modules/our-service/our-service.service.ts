import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOurServiceDto, UpdateOurServiceDto } from './dto';
import { OurService } from './our-service.entity';

@Injectable()
export class OurServiceService {
  constructor(
    @InjectRepository(OurService)
    private readonly ourServiceRepository: Repository<OurService>,
  ) {}

  async getAll(
    options?: IPaginationOptions,
    where?: FindOptionsWhere<OurService>,
  ): Promise<Pagination<OurService>> {
    return paginate<OurService>(this.ourServiceRepository, options, {});
  }

  async getById(id: string) {
    const category = await this.ourServiceRepository.findOne({
      relations: {},
      where: { id },
    });

    if (!category) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async delete(id: string) {
    const response = await this.ourServiceRepository.delete(id);
    return response;
  }

  async update(value: UpdateOurServiceDto, id: string) {
    const response = await this.ourServiceRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateOurServiceDto) {
    const data = this.ourServiceRepository.create(value);
    return await this.ourServiceRepository.save(data);
  }
}
