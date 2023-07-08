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

import { CreateSubServiceDto, UpdateSubServiceDto } from './dto';
import { SubServiceService } from './sub-service.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Query } from '@nestjs/common/decorators';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('Sub-Service')
@Controller('sub-service')
export class SubServiceController {
  constructor(private readonly subServiceService: SubServiceService) {}

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns sub service by id' })
  @ApiOkResponse({
    description: 'The sub service was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return this.subServiceService.getById(id);
  }

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all sub services' })
  @ApiOkResponse({
    description: 'The sub services were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.subServiceService.getAll({ ...query, route });
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new sub service' })
  @ApiCreatedResponse({
    description: 'The sub service was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() categoryData: CreateSubServiceDto) {
    return await this.subServiceService.create(categoryData);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating sub service' })
  @ApiOkResponse({
    description: 'Sub service was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() userData: UpdateSubServiceDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.subServiceService.update(userData, id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting sub service' })
  @ApiOkResponse({
    description: 'Sub service was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.subServiceService.delete(id);
  }
}
