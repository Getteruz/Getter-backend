import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './user.repository';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';
import { FileService } from '../file/file.service';
import { PositionService } from '../position/position.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    private readonly connection: DataSource,
    private readonly fileService: FileService,
    private readonly positionService: PositionService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<User>,
  ): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      order: {
        name: 'ASC',
      },
      relations: {
        avatar: true,
        position: true,
      },
    });
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: {
        avatar: true,
        position: true,
        articles: {
          avatar: true,
        },
      },
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.usersRepository.delete(id);
    return response;
  }

  async change(
    value: UpdateUserDto,
    id: string,
    file: Express.Multer.File,
    request,
  ) {
    const response = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(value as unknown as User)
      .where('id = :id', { id })
      .execute();

    if (file) {
      return await this.updateImage(file, id, request);
    } else {
      return response;
    }
  }

  async create(userData: CreateUserDto, file: Express.Multer.File, request) {
    try {
      const user = new User();

      user.name = userData.name;
      user.email = userData.email;
      user.phone = userData.phone;

      if (file) {
        const avatar = await this.uploadImage(file, request);
        user.avatar = avatar;
      } else {
        const avatar = await this.fileService.createFile();
        user.avatar = avatar;
      }
      const position = await this.positionService.getOne(userData.position);
      user.position = position;
      user.description = userData.description;

      await user.hashPassword(userData.password);
      await this.connection.transaction(async (manager: EntityManager) => {
        await manager.save(user);
      });
      await this.mailService.register({
        ...user,
        password: userData.password,
      });

      const newUser = await this.getOne(user.id);
      return newUser;
    } catch (err) {
      if (err?.errno === 1062) {
        throw new Error('This user already exists.');
      }
      throw err;
    }
  }

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getOne(id);
    const avatar = await this.fileService.updateFile(
      data.avatar.id,
      file,
      request,
    );
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async deleteImage(id: string) {
    const data = await this.getOne(id);
    if (data?.avatar?.id) {
      const deletedAvatar = await this.fileService.removeFile(data.avatar.id);
    }
  }

  async setTrueEmail(id) {
    const user = await this.getOne(id);
    user.isEmailValid = true;
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(user);
    });
    return user;
  }
}
