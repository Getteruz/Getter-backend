import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';

import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UserModule {}
