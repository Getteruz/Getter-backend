import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRole } from '../../infra/shared/types';
import { Position } from '../position/position.entity';
import { Article } from '../article/article.entity';
import { Comment } from '../comment/comment.entity';
import { FileEntity } from '../file/file.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 1 })
  role: UserRole;

  @Column()
  phone: string;

  @ManyToOne(() => Position, (position) => position.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  position: Position;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToOne(() => FileEntity, (file) => file.user)
  @JoinColumn()
  avatar: FileEntity;

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
