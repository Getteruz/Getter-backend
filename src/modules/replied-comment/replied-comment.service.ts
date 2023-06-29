import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { CreateRepliedCommentDto, UpdateRepliedCommentDto } from './dto';
import { RepliedCommentRepository } from './replied-comment.repository';
import { RepliedComment } from './replied-comment.entity';

@Injectable()
export class RepliedCommentService {
  constructor(
    @InjectRepository(RepliedComment)
    private readonly repliedCommentRepository: RepliedCommentRepository,
  ) {}

  async getAll() {
    return this.repliedCommentRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async getById(id: string) {
    const comment = await this.repliedCommentRepository.findOne({
      relations: {
        user: true,
      },
      where: { id },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async delete(id: string) {
    const response = await this.repliedCommentRepository.delete(id);
    return response;
  }

  async update(value: UpdateRepliedCommentDto, id: string) {
    const response = await this.repliedCommentRepository.update({ id }, value);
    return response;
  }

  async create(values: CreateRepliedCommentDto) {
    const response = await this.repliedCommentRepository
      .createQueryBuilder()
      .insert()
      .into(RepliedComment)
      .values(values as unknown as RepliedComment)
      .returning('id')
      .execute();

    return response;
  }
}
