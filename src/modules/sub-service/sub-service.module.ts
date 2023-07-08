import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubService } from './sub-service.entity';
import { SubServiceController } from './sub-service.controller';
import { SubServiceService } from './sub-service.service';
import { OurServiceModule } from '../our-service/our-service.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubService]), OurServiceModule],
  controllers: [SubServiceController],
  providers: [SubServiceService],
})
export class SubServiceModule {}
