import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { MulterStorage } from '../../infra/helpers';
import { FileUploadValidationForCreate } from '../../infra/validators';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload-file')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: Uploads new file' })
  @ApiCreatedResponse({
    description: 'The file was successfully uploaded',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/image/file'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFile(FileUploadValidationForCreate) file: Express.Multer.File,
    @Req() request,
  ) {
    return await this.fileService.uploadFile(file, request);
  }

  @Delete('/remove-file/:id')
  @ApiOperation({ summary: 'Method: deleting file' })
  @ApiOkResponse({
    description: 'File was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.fileService.removeFile(id);
  }
}
