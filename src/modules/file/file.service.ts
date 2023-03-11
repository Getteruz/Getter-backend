import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource } from 'typeorm';
import * as fs from 'fs';

import { FileRepository } from './file.repository';
import { FileEntity } from './file.entity';
import { ScreenShotWebsite } from '../../infra/helpers';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly connection: DataSource,
  ) {}

  async uploadFile(file: Express.Multer.File, request) {
    const url =
      request.protocol +
      '://' +
      request.hostname +
      ':4000/' +
      file.path.split('uploads\\')[1];
    const path = file.path;

    const newFile = new FileEntity();
    newFile.path = path;
    newFile.url = url;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(newFile);
    });

    return newFile;
  }

  async removeFile(id: string) {
    const file = await this.fileRepository.getById(id);
    await this.deleteFileWithFs(file.path);
    await this.fileRepository.remove(id);
  }

  async updateFile(id: string, file: Express.Multer.File, request) {
    const changedFile = await this.fileRepository.getById(id);

    await this.deleteFileWithFs(changedFile.path);

    const url =
      request.protocol +
      '://' +
      request.hostname +
      ':4000/' +
      file.path.split('uploads\\')[1];
    const path = file.path;

    changedFile.url = url;
    changedFile.path = path;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(changedFile);
    });

    return changedFile;
  }

  async deleteFileWithFs(path) {
    return fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }

  async uploadScreenshotWebsite(link: string, title: string, request) {
    const name = title + `${new Date().getTime()}` + '.png';
    const path = 'uploads/image/website/' + name;
    const url =
      request.protocol +
      '://' +
      request.hostname +
      ':4000/image/website/' +
      name;

    const newFile = new FileEntity();
    newFile.path = path;
    newFile.url = url;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(newFile);
    });

    try {
      await ScreenShotWebsite(link, path);
    } catch (err) {
      return newFile;
    }

    return newFile;
  }
}
