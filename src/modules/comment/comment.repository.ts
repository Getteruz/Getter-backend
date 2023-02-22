import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './dto';

import { Comment } from './comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getAll() {
    return this.commentRepository.createQueryBuilder().getMany();
  }

  async getById(id: string): Promise<Comment> {
    return this.commentRepository
      .createQueryBuilder('')
      .where('id = :id', { id })
      .getOne();
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.commentRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async create(values: CreateCommentDto): Promise<InsertResult> {
    return this.commentRepository
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values(values as unknown as Comment)
      .returning('id')
      .execute();
  }

  async update(values: UpdateCommentDto, id: string): Promise<UpdateResult> {
    return this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set(values as unknown as Comment)
      .where('id = :id', { id })
      .execute();
  }
}
