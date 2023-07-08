import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  UpdatePortfolioDto,
  CreatePortfolioDto,
  LikePortfolioDto,
} from './dto';
import { FileService } from '../file/file.service';
import { Portfolio } from './portfolio.entity';
import { UsersService } from '../user/user.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
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
        date: 'ASC',
      },
      relations: {
        avatar: true,
      },
    });
  }

  async getById(id: string, cookie?) {
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
    if (cookie.user_id) {
      const isLiked = portfolio.likes.find((u) => u.id == cookie.user_id);
      if (isLiked) {
        return { data: { ...portfolio, isLiked: true } };
      } else {
        return { data: { ...portfolio, isLiked: false } };
      }
    }

    return { data: { ...portfolio, isLiked: false } };
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
    req,
  ) {
    if (file) {
      const avatar = await this.updateImage(file, id, req);
      values.avatar = avatar;
    }

    const response = await this.portfolioRepository
      .createQueryBuilder()
      .update(Portfolio)
      .set(values as unknown as Portfolio)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(values: CreatePortfolioDto, file: Express.Multer.File, request) {
    if (file) {
      const avatar = await this.uploadImage(file, request);
      values.avatar = avatar.id;
    }

    const response = await this.portfolioRepository
      .createQueryBuilder()
      .insert()
      .into(Portfolio)
      .values(values as unknown as Portfolio)
      .returning('id')
      .execute();

    return response
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

  async uploadImage(file: Express.Multer.File, request) {
    const avatar = await this.fileService.uploadFile(file, request);
    return avatar;
  }

  async updateImage(file: Express.Multer.File, id: string, request) {
    const data = await this.getOne(id);
    let avatar;
    if (data?.avatar?.id) {
      avatar = await this.fileService.updateFile(data.avatar.id, file, request);
    } else {
      avatar = await this.fileService.uploadFile(file, request);
    }

    return avatar;
  }

  async deleteImage(id: string) {
    const data = await this.getOne(id);
    if (data?.avatar?.id) {
      await this.fileService.removeFile(data.avatar.id);
    }
  }
}
