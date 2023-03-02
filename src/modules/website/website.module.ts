import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';

import { WebsiteController } from './website.controller';
import { Website } from './website.entity';
import { WebsiteRepository } from './website.repository';
import { WebsiteService } from './website.service';

@Module({
  imports: [TypeOrmModule.forFeature([Website]), FileModule, UserModule],
  controllers: [WebsiteController],
  providers: [WebsiteService, WebsiteRepository],
  exports: [WebsiteService, WebsiteRepository],
})
export class WebsiteModule {}
