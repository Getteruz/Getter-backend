import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { CreatePositionDto, UpdatePositionDto } from './dto';
import { Position } from './position.entity';

@Injectable()
export class PositionRepository {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async getAll() {
    return this.positionRepository.createQueryBuilder().getManyAndCount();
  }

  async getById(id: string): Promise<Position> {
    return this.positionRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.positionRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async create(values: CreatePositionDto): Promise<InsertResult> {
    return this.positionRepository
      .createQueryBuilder()
      .insert()
      .into(Position)
      .values(values as unknown as Position)
      .returning('id')
      .execute();
  }

  async update(values: UpdatePositionDto, id: string): Promise<UpdateResult> {
    return this.positionRepository
      .createQueryBuilder()
      .update(Position)
      .set(values as unknown as Position)
      .where('id = :id', { id })
      .execute();
  }
}
