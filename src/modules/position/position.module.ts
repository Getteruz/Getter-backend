import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionController } from './position.controller';
import { Position } from './position.entity';
import { PositionRepository } from './position.repository';
import { PositionService } from './position.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  controllers: [PositionController],
  providers: [PositionService, PositionRepository],
  exports: [PositionService, PositionRepository],
})
export class PositionModule {}
