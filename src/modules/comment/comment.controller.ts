import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateCommentDto, UpdateCommentDto } from './dto';
import { CommentService } from './comment.service';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns comment by id' })
  @ApiOkResponse({
    description: 'The comment was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return this.commentService.getById(id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all comments' })
  @ApiOkResponse({
    description: 'The comments were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.commentService.getAll();
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new comment' })
  @ApiCreatedResponse({
    description: 'The comment was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() categoryData: CreateCommentDto) {
    return await this.commentService.create(categoryData);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating comment' })
  @ApiOkResponse({
    description: 'Comment was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() userData: UpdateCommentDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.commentService.update(userData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting comment' })
  @ApiOkResponse({
    description: 'Comment was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.commentService.delete(id);
  }
}
