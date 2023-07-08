import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliedComment } from './replied-comment.entity';
import { RepliedCommentController } from './replied-comment.controller';
import { RepliedCommentService } from './replied-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([RepliedComment])],
  controllers: [RepliedCommentController],
  providers: [RepliedCommentService],
  exports: [RepliedCommentService],
})
export class RepliedCommentModule {}
