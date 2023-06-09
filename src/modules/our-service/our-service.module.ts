import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OurService } from './our-service.entity';
import { OurServiceController } from './our-service.controller';
import { OurServiceService } from './our-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([OurService])],
  controllers: [OurServiceController],
  providers: [OurServiceService],
  exports: [OurServiceService],
})
export class OurServiceModule {}
