import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliedComment } from './replied-comment.entity';
import { RepliedCommentController } from './replied-comment.controller';
import { RepliedCommentRepository } from './replied-comment.repository';
import { RepliedCommentService } from './replied-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([RepliedComment])],
  controllers: [RepliedCommentController],
  providers: [RepliedCommentService, RepliedCommentRepository],
  exports: [RepliedCommentService, RepliedCommentRepository],
})
export class RepliedCommentModule {}
