import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Comment } from '../comment/comment.entity';
import { FileEntity } from '../file/file.entity';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn()
  user: User;

  @OneToOne(() => FileEntity, (file) => file.article)
  @JoinColumn()
  avatar: FileEntity;
}
