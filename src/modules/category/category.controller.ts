import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryService } from './category.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Query } from '@nestjs/common/decorators';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns category by id' })
  @ApiOkResponse({
    description: 'The category was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return this.categoryService.getById(id);
  }

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all categories' })
  @ApiOkResponse({
    description: 'The categories were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.categoryService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new category' })
  @ApiCreatedResponse({
    description: 'The category was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() categoryData: CreateCategoryDto) {
    try {
      return await this.categoryService.create(categoryData);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating category' })
  @ApiOkResponse({
    description: 'Category was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() userData: UpdateCategoryDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.categoryService.update(userData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting category' })
  @ApiOkResponse({
    description: 'Category was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.categoryService.delete(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
