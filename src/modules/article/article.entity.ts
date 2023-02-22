import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';

@Entity({ name: 'article' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @Column({ default: 0 })
  like: number;

  @Column('text', { array: true })
  tags: string[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];
}
