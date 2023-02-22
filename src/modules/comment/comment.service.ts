import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getAll() {
    const categories = await this.commentRepository.getAll();
    return categories;
  }

  async getById(id: string) {
    const data = await this.commentRepository.getById(id);
    if (!data) {
      throw new HttpException('Category not Found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async delete(id: string) {
    const response = await this.commentRepository.remove(id);
    return response;
  }

  async update(value: UpdateCommentDto, id: string) {
    const response = await this.commentRepository.update(value, id);
    return response;
  }

  async create(value: CreateCommentDto) {
    const response = await this.commentRepository.create(value);
    return response;
  }
}
