import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn()
  article: Article;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user: User;
}
