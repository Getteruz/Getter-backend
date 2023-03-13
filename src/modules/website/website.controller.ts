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
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreateWebsiteDto, LikeDto, UpdateWebsiteDto } from './dto';
import { Website } from './website.entity';
import { WebsiteService } from './website.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { MulterStorage } from '../../infra/helpers';
import { FileUploadValidationForUpdate } from '../../infra/validators';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Website')
@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all websites' })
  @ApiOkResponse({
    description: 'The websites were returned successfully',
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
      return await this.websiteService.getAll(
        { limit: query.limit, page: query.page, route },
        where,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single website by id' })
  @ApiOkResponse({
    description: 'The website was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string, @Req() { cookies }): Promise<{ data }> {
    return this.websiteService.getById(id, cookies);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new website' })
  @ApiCreatedResponse({
    description: 'The website was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @Body() data: CreateWebsiteDto,
    @Req() request: Request,
  ): Promise<Website> {
    try {
      return await this.websiteService.create(data, request);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/add-like/:websiteId')
  @ApiOperation({ summary: 'Method: adds like to website' })
  @ApiCreatedResponse({
    description: 'The like added successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addLikeToArticle(
    @Req() request,
    @Param('websiteId') id: string,
  ): Promise<Website> {
    try {
      return await this.websiteService.addLikeToWebsite({
        websiteId: id,
        userId: request.user.id,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/remove-like/:websiteId')
  @ApiOperation({ summary: 'Method: removes like from website' })
  @ApiCreatedResponse({
    description: 'The like removed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeLikeFromArticle(
    @Req() request,
    @Param('websiteId') id: string,
  ): Promise<Website> {
    try {
      return await this.websiteService.removeLikeFromWebsite({
        websiteId: id,
        userId: request.user.id,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating website' })
  @ApiOkResponse({
    description: 'Website was changed',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/website'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdateWebsiteDto,
    @Param('id') id: string,
    @Req() request,
  ): Promise<UpdateResult | Website> {
    try {
      return await this.websiteService.change(data, id, file, request);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/isActive/:id')
  @ApiOperation({ summary: 'Method: updating website isActive' })
  @ApiOkResponse({
    description: 'Website active was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeIsActive(
    @Body() data: { isActive: boolean },
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.websiteService.changeIsActive(data.isActive, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting website' })
  @ApiOkResponse({
    description: 'Website was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.websiteService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
