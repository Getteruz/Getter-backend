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

import { CreateOurServiceDto, UpdateOurServiceDto } from './dto';
import { OurServiceService } from './our-service.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Query } from '@nestjs/common/decorators';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('Our-Service')
@Controller('our-service')
export class OurServiceController {
  constructor(private readonly ourServiceService: OurServiceService) {}

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns our service by id' })
  @ApiOkResponse({
    description: 'The our service was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return this.ourServiceService.getById(id);
  }

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all our services' })
  @ApiOkResponse({
    description: 'The our services were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.ourServiceService.getAll({ ...query, route });
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new our service' })
  @ApiCreatedResponse({
    description: 'The our service was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() categoryData: CreateOurServiceDto) {
    return await this.ourServiceService.create(categoryData);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating our service' })
  @ApiOkResponse({
    description: 'Our service was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() userData: UpdateOurServiceDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.ourServiceService.update(userData, id);
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting our service' })
  @ApiOkResponse({
    description: 'Our service was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.ourServiceService.delete(id);
  }
}
