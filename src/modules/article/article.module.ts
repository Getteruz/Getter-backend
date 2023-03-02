import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';

import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), FileModule, UserModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
  exports: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
