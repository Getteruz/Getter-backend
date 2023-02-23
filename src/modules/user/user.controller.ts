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
  Query,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import {
  FileUploadValidationForCreate,
  FileUploadValidationForUpdate,
} from '../../infra/validators';
import { MulterStorage } from '../../infra/helpers';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UsersService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Method: returns current user' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request) {
    return this.usersService.getById(request.user.id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all users' })
  @ApiOkResponse({
    description: 'The users were returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.OK)
  async getData(): Promise<{ items: User[]; totalItemsCount: number }> {
    try {
      return await this.usersService.getAll();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new user' })
  @ApiCreatedResponse({
    description: 'The user was created successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/user'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async register(
    @UploadedFile(FileUploadValidationForCreate) file: Express.Multer.File,
    @Body() userData: CreateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.create(userData, file);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating user' })
  @ApiOkResponse({
    description: 'User was changed',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/user'),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async changeData(
    @UploadedFile(FileUploadValidationForUpdate) file: Express.Multer.File,
    @Body() userData: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult | User> {
    try {
      return await this.usersService.change(userData, id, file);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'User was deleted',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.usersService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
