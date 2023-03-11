import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';

import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), FileModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
