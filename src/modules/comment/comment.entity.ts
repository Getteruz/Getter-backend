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

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  article: Article;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
