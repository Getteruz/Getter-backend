import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { Article } from '../article/article.entity';

import { User } from '../user/user.entity';
import { Website } from '../website/website.entity';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  path: string;

  @OneToOne(() => User, (user) => user.avatar)
  user: User;

  @OneToOne(() => Article, (article) => article.avatar)
  article: Article;

  @OneToOne(() => Website, (website) => website.avatar)
  website: Website;
}
