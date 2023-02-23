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
} from '@nestjs/common';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateWebsiteDto, UpdateWebsiteDto } from './dto';
import { Website } from './website.entity';
import { WebsiteService } from './website.service';

@ApiTags('Website')
@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all websites' })
  @ApiOkResponse({
    description: 'The websites were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(): Promise<{ items: Website[]; totalItemsCount: number }> {
    try {
      return await this.websiteService.getAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating website' })
  @ApiOkResponse({
    description: 'Website was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateWebsiteDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.websiteService.change(data, id);
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
