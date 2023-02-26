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

import { CreatePositionDto, UpdatePositionDto } from './dto';
import { Position } from './position.entity';
import { PositionService } from './position.service';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Position')
@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all positions' })
  @ApiOkResponse({
    description: 'The positions were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.positionService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single position by id' })
  @ApiOkResponse({
    description: 'The position was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Position> {
    return this.positionService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new position' })
  @ApiCreatedResponse({
    description: 'The position was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() positionData: CreatePositionDto): Promise<Position> {
    try {
      return await this.positionService.create(positionData);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating position' })
  @ApiOkResponse({
    description: 'Position was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() positionData: UpdatePositionDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.positionService.change(positionData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting position' })
  @ApiOkResponse({
    description: 'Position was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.positionService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
