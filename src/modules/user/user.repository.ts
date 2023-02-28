import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAll() {
    return this.usersRepository.createQueryBuilder().getManyAndCount();
  }

  async findOne(query = {}): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  async getById(id: string): Promise<any> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.position', 'position')
      .leftJoinAndSelect('user.articles', 'article')
      .leftJoinAndSelect('user.avatar', 'file')
      .getOne();
  }

  async getByEmail(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();
  }

  async getManyUsersById(ids: string[]) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id IN(:...ids)', { ids })
      .getMany();
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async softDelete(id: string): Promise<DeleteResult> {
    return this.usersRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();
  }

  async create(values: CreateUserDto): Promise<InsertResult> {
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(values as unknown as User)
      .returning('id')
      .execute();
  }

  async update(id: string, values: any): Promise<UpdateResult> {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(values as any)
      .where('id = :id', { id })
      .execute();
  }
}
