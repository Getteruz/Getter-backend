import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './user.repository';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    private readonly connection: DataSource,
  ) {}

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.getById(id);
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getAll() {
    const [data, count] = await this.usersRepository.getAll();
    return { items: data, totalItemsCount: count };
  }

  async getOne(id: string): Promise<User> {
    const user = await this.usersRepository.getById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.getByEmail(email);
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async deleteOne(id: string) {
    const response = await this.usersRepository.remove(id);
    return response;
  }

  async change(value: UpdateUserDto, id: string, file: Express.Multer.File) {
    const response = await this.usersRepository.update(id, value);
    return response;
  }

  async create(userData: CreateUserDto, file: Express.Multer.File) {
    try {
      const user = new User();

      user.name = userData.name;
      user.email = userData.email;
      user.phone = userData.phone;

      await user.hashPassword(userData.password);
      await this.connection.transaction(async (manager: EntityManager) => {
        await manager.save(user);
      });
      await this.mailService.register({ ...user, password: userData.password,id:user.id });

      const newUser = await this.usersRepository.getById(user.id);
      return newUser;
    } catch (err) {
      if (err?.errno === 1062) {
        throw new Error('This user already exists.');
      }
      throw err;
    }
  }
}
