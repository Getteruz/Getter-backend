import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Patch,
  Param,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreatePortfolioDto, UpdatePortfolioDto } from './dto';
import { Portfolio } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';
import { MulterStorage } from '../../infra/helpers';
import {
  FileUploadValidationForCreate,
  FileUploadValidationForUpdate,
} from '../../infra/validators';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Query } from '@nestjs/common/decorators';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all portfolios' })
  @ApiOkResponse({
    description: 'The portfolios were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.portfolioService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single portfolio by id' })
  @ApiOkResponse({
    description: 'The portfolio was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Portfolio> {
    return this.portfolioService.getOne(id);
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new portfolio' })
  @ApiCreatedResponse({
    description: 'The portfolio was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/portfolio'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFile(FileUploadValidationForCreate) file: Express.Multer.File,
    @Body() data: CreatePortfolioDto,
  ): Promise<InsertResult | Portfolio> {
    try {
      return await this.portfolioService.create(data, file);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating portfolio' })
  @ApiOkResponse({
    description: 'Portfolio was changed',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/portfolio'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdatePortfolioDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | Portfolio> {
    try {
      return await this.portfolioService.change(data, id, file);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting portfolio' })
  @ApiOkResponse({
    description: 'Portfolio was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.portfolioService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
