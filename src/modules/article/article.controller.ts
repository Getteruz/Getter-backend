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

import { CreateArticleDto, UpdateArticleDto } from './dto';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { MulterStorage } from '../../infra/helpers';
import {
  FileUploadValidationForCreate,
  FileUploadValidationForUpdate,
} from '../../infra/validators';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all articles' })
  @ApiOkResponse({
    description: 'The articles were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(): Promise<{ items: Article[]; totalItemsCount: number }> {
    try {
      return await this.articleService.getAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single article by id' })
  @ApiOkResponse({
    description: 'The article was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Article> {
    return this.articleService.getOne(id);
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new article' })
  @ApiCreatedResponse({
    description: 'The article was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/article'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFile(FileUploadValidationForCreate) file: Express.Multer.File,
    @Body() data: CreateArticleDto,
  ): Promise<InsertResult | Article> {
    try {
      return await this.articleService.create(data, file);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating article' })
  @ApiOkResponse({
    description: 'Article was changed',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/article'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdateArticleDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | Article> {
    try {
      return await this.articleService.change(data, id, file);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting article' })
  @ApiOkResponse({
    description: 'Article was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.articleService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
