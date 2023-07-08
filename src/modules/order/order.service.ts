import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateOrderDto, CreateOrderDto } from './dto';
import { FileService } from '../file/file.service';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
  ) {}

  async getAll(options: IPaginationOptions, where): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options, {
      order: {
        date: 'DESC',
      },
      relations: {
        avatar: true,
      },
      where,
    });
  }

  async getById(id: string) {
    const article = await this.orderRepository.findOne({
      relations: {
        avatar: true,
      },
      where: { id },
    });

    if (!article) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.orderRepository.delete(id);
    return response;
  }

  async change(
    values: UpdateOrderDto,
    id: string,
    file: Express.Multer.File,
    request,
  ) {
    const response = await this.orderRepository
      .createQueryBuilder()
      .update(Order)
      .set(values as unknown as Order)
      .where('id = :id', { id })
      .execute();

    if (file) {
      return await this.updateImage(file, id, request);
    } else {
      return response;
    }
  }

  async create(values: CreateOrderDto, file: Express.Multer.File, request) {
    const response = await this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(values as unknown as Order)
      .returning('id')
      .execute();

    const id = response.raw[0].id;

    if (file) {
      return await this.uploadImage(file, id, request);
    } else {
      return response;
    }
  }

  async uploadImage(file: Express.Multer.File, id: string, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    const data = await this.getById(id);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getById(id);
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
    const data = await this.getById(id);
    const deletedAvatar = await this.fileService.removeFile(data.avatar.id);
  }
}
