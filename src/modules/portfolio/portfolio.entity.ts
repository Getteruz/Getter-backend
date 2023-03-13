import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { FileEntity } from '../file/file.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'portfolio' })
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column()
  link: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @ManyToMany(() => User, (user) => user.portfolioLikes, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: User[];

  @OneToOne(() => FileEntity, (file) => file.website, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;
}
