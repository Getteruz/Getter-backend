import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UpdatePositionDto, CreatePositionDto } from './dto';
import { PositionRepository } from './position.repository';

@Injectable()
export class PositionService {
  constructor(private readonly positionRepository: PositionRepository) {}

  async getAll() {
    const [data, count] = await this.positionRepository.getAll();
    return { items: data, totalItemsCount: count };
  }

  async getOne(id: string) {
    const position = await this.positionRepository.getById(id);
    if (!position) {
      throw new HttpException('Position not found', HttpStatus.NOT_FOUND);
    }
    return position;
  }

  async deleteOne(id: string) {
    const response = await this.positionRepository.remove(id);
    return response;
  }

  async change(value: UpdatePositionDto, id: string) {
    const response = await this.positionRepository.update(value, id);
    return response;
  }

  async create(value: CreatePositionDto) {
    const response = await this.positionRepository.create(value);
    return response;
  }
}
