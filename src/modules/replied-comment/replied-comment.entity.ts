import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'replied_comment' })
export class RepliedComment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @ManyToOne(() => Comment, (comment) => comment.repliedComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => User, (user) => user.repliedComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
