import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getAll() {
    return this.commentRepository.find({
      relations: {
        user: true,
        article: true,
      },
    });
  }

  async getById(id: string) {
    const comment = await this.commentRepository.findOne({
      relations: {
        user: true,
        article: true,
      },
      where: { id },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  async delete(id: string) {
    const response = await this.commentRepository.delete(id);
    return response;
  }

  async update(value: UpdateCommentDto, id: string) {
    const response = await this.commentRepository.update({ id }, value);
    return response;
  }

  async create(values: CreateCommentDto) {
    const response = await this.commentRepository
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values(values as unknown as Comment)
      .returning('id')
      .execute();

    return response;
  }
}
