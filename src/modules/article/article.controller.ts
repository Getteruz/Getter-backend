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
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Query, Req } from '@nestjs/common/decorators';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all articles' })
  @ApiOkResponse({
    description: 'The articles were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      let where;
      if (query.isActive == 'true') {
        where = { isActive: true };
      } else if (query.isActive == 'false') {
        where = { isActive: false };
      } else {
        where = {};
      }
      return await this.articleService.getAll(
        { limit: query.limit, page: query.page, route },
        where,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single article by id' })
  @ApiOkResponse({
    description: 'The article was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string, @Req() { cookies }): Promise<{ data }> {
    console.log(cookies);

    return this.articleService.getOne(id, cookies);
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new article' })
  @ApiCreatedResponse({
    description: 'The article was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/article'),
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

  @Post('/add-like/:articleId')
  @ApiOperation({ summary: 'Method: adds like to article' })
  @ApiCreatedResponse({
    description: 'The like added successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addLikeToArticle(
    @Req() request,
    @Param('articleId') articleId: string,
  ): Promise<Article> {
    try {
      return await this.articleService.addLikeToArticle({
        userId: request.user.id,
        articleId,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/remove-like')
  @ApiOperation({ summary: 'Method: removes like from article' })
  @ApiCreatedResponse({
    description: 'The like removed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeLikeFromArticle(
    @Req() request,
    @Param('articleId') articleId: string,
  ): Promise<Article> {
    try {
      return await this.articleService.removeLikeFromArticle({
        userId: request.user.id,
        articleId,
      });
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
      storage: MulterStorage('uploads/image/article'),
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
