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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
      return await this.websiteService.getAll({ ...query, route });
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
  async getMe(@Param('id') id: string): Promise<Website> {
    return this.websiteService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new website' })
  @ApiCreatedResponse({
    description: 'The website was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateWebsiteDto): Promise<Website> {
    try {
      return await this.websiteService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/add-like')
  @ApiOperation({ summary: 'Method: adds like to website' })
  @ApiCreatedResponse({
    description: 'The like added successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addLikeToArticle(@Body() data: LikeDto): Promise<Website> {
    try {
      return await this.websiteService.addLikeToWebsite(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/remove-like')
  @ApiOperation({ summary: 'Method: removes like from website' })
  @ApiCreatedResponse({
    description: 'The like removed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeLikeFromArticle(@Body() data: LikeDto): Promise<Website> {
    try {
      return await this.websiteService.removeLikeFromWebsite(data);
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
      storage: MulterStorage('uploads/website'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdateWebsiteDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | Website> {
    try {
      return await this.websiteService.change(data, id, file);
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
