import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource } from 'typeorm';
import * as fs from 'fs';

import { FileRepository } from './file.repository';
import { FileEntity } from './file.entity';

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
      file.path.split('uploads')[1];
    const path = file.path;

    const newFile = new FileEntity();
    newFile.path = path;
    newFile.url = url;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(newFile);
    });

    return newFile;
  }

  async createFile() {
    const data = await this.fileRepository.create({ url: null, path: null });
    const id = data.raw[0].id;
    return await this.fileRepository.getById(id);
  }

  async removeFile(id: string) {
    const file = await this.fileRepository.getById(id);
    if (file.path) {
      await this.deleteFileWithFs(file.path);
    }
    await this.fileRepository.remove(id);
  }

  async updateFile(id: string, file: Express.Multer.File, request) {
    const changedFile = await this.fileRepository.getById(id);

    if (changedFile.path) {
      await this.deleteFileWithFs(changedFile.path);
    }

    const url =
      request.protocol +
      '://' +
      request.hostname +
      file.path.split('uploads')[1];
    const path = file.path;

    changedFile.url = url;
    changedFile.path = path;

    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(changedFile);
    });

    return changedFile;
  }

  async deleteFileWithFs(path) {
    try {
      return fs.unlink(path, (err) => {
        if (err) console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
