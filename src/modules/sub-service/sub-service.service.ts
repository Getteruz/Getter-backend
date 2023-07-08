import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSubServiceDto, UpdateSubServiceDto } from './dto';
import { SubService } from './sub-service.entity';
import { OurServiceService } from '../our-service/our-service.service';

@Injectable()
export class SubServiceService {
  constructor(
    @InjectRepository(SubService)
    private readonly subServiceRepository: Repository<SubService>,
    private readonly ourServiceService: OurServiceService,
  ) {}

  async getAll(
    options?: IPaginationOptions,
    where?: FindOptionsWhere<SubService>,
  ): Promise<Pagination<SubService>> {
    return paginate<SubService>(this.subServiceRepository, options, {});
  }

  async getById(id: string) {
    const data = await this.subServiceRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async delete(id: string) {
    const response = await this.subServiceRepository.delete(id);
    return response;
  }

  async update(value: UpdateSubServiceDto, id: string) {
    const response = await this.subServiceRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateSubServiceDto) {
    const ourService = await this.ourServiceService.getById(value.ourService);
    const data = this.subServiceRepository.create({ ...value, ourService });
    return await this.subServiceRepository.save(data);
  }
}
