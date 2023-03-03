import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  UpdatePortfolioDto,
  CreatePortfolioDto,
  LikePortfolioDto,
} from './dto';
import { PortfolioRepository } from './portfolio.repository';
import { FileService } from '../file/file.service';
import { Portfolio } from './portfolio.entity';
import { UsersService } from '../user/user.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: PortfolioRepository,
    private readonly fileService: FileService,
    private readonly connection: DataSource,
    private readonly userService: UsersService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Portfolio>,
  ): Promise<Pagination<Portfolio>> {
    return paginate<Portfolio>(this.portfolioRepository, options, {
      order: {
        title: 'ASC',
      },
      relations: {
        avatar: true,
      },
    });
  }

  async getOne(id: string) {
    const portfolio = await this.portfolioRepository.findOne({
      relations: {
        avatar: true,
        likes: true,
      },
      where: { id },
    });

    if (!portfolio) {
      throw new HttpException('Portfolio not found', HttpStatus.NOT_FOUND);
    }

    return portfolio;
  }

  async deleteOne(id: string) {
    await this.deleteImage(id);
    const response = await this.portfolioRepository.delete(id);
    return response;
  }

  async change(
    values: UpdatePortfolioDto,
    id: string,
    file: Express.Multer.File,
  ) {
    const response = await this.portfolioRepository.update({ id }, values);

    if (file) {
      return await this.updateImage(file, id);
    } else {
      return response;
    }
  }

  async create(values: CreatePortfolioDto, file: Express.Multer.File) {
    const response = await this.portfolioRepository
      .createQueryBuilder()
      .insert()
      .into(Portfolio)
      .values(values as unknown as Portfolio)
      .returning('id')
      .execute();

    const id = response.raw[0].id;

    if (file) {
      return await this.uploadImage(file, id);
    } else {
      return response;
    }
  }

  async addLikeToPortfolio(values: LikePortfolioDto) {
    const portfolio = await this.getOne(values.portfolioId);
    const user = await this.userService.getById(values.userId);

    portfolio.likes = portfolio.likes || [];
    portfolio.likes.push(user);
    portfolio.likesCount = portfolio.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(portfolio);
    });
    return portfolio;
  }

  async removeLikeFromPortfolio(values: LikePortfolioDto) {
    const portfolio = await this.getOne(values.portfolioId);

    portfolio.likes = portfolio.likes || [];
    portfolio.likes = portfolio.likes.filter((u) => u.id != values.userId);
    portfolio.likesCount = portfolio.likes.length;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(portfolio);
    });
    return portfolio;
  }

  async uploadImage(file: Express.Multer.File, id: string) {
    const avatar = await this.fileService.uploadFile(file);
    const data = await this.getOne(id);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async updateImage(file: Express.Multer.File, id: string) {
    const data = await this.getOne(id);
    const avatar = await this.fileService.updateFile(data.avatar.id, file);
    data.avatar = avatar;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });

    return data;
  }

  async deleteImage(id: string) {
    const data = await this.getOne(id);
    const deletedAvatar = await this.fileService.removeFile(data.avatar.id);
  }
}
