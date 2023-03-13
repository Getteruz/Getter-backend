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
  Query,
  Req,
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

import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { MulterStorage } from '../../infra/helpers';
import {
  FileUploadValidationForCreate,
  FileUploadValidationForUpdate,
} from '../../infra/validators';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRoles } from '../../infra/shared/enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all orders' })
  @ApiOkResponse({
    description: 'The orders were returned successfully',
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
      return await this.orderService.getAll(
        { limit: query.limit, page: query.page, route },
        where,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single order by id' })
  @ApiOkResponse({
    description: 'The order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Order> {
    return this.orderService.getById(id);
  }

  @Public()
  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: creates new order' })
  @ApiCreatedResponse({
    description: 'The order was created successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/order'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFile(FileUploadValidationForCreate) file: Express.Multer.File,
    @Body() data: CreateOrderDto,
    @Req() request,
  ): Promise<InsertResult | Order> {
    try {
      return await this.orderService.create(data, file, request);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: updating order' })
  @ApiOkResponse({
    description: 'Order was changed',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/order'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() data: UpdateOrderDto,
    @Param('id') id: string,
    @Req() request,
  ): Promise<UpdateResult | Order> {
    try {
      return await this.orderService.change(data, id, file, request);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting order' })
  @ApiOkResponse({
    description: 'Order was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.orderService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
