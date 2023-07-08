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

import { CreateRepliedCommentDto, UpdateRepliedCommentDto } from './dto';
import { RepliedCommentService } from './replied-comment.service';

@ApiTags('Replied-Comment')
@Controller('replied-comment')
export class RepliedCommentController {
  constructor(private readonly repliedCommentService: RepliedCommentService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns replied comment by id' })
  @ApiOkResponse({
    description: 'The replied comment was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return this.repliedCommentService.getById(id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all replied comments' })
  @ApiOkResponse({
    description: 'The replied comments were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.repliedCommentService.getAll();
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new comment' })
  @ApiCreatedResponse({
    description: 'The replied comment was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateRepliedCommentDto) {
    return await this.repliedCommentService.create(data);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating replied comment' })
  @ApiOkResponse({
    description: 'Replied comment was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() userData: UpdateRepliedCommentDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.repliedCommentService.update(userData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting replied comment' })
  @ApiOkResponse({
    description: 'Replied comment was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.repliedCommentService.delete(id);
  }
}
