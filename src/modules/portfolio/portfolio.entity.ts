import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { FileEntity } from '../file/file.entity';

@Entity({ name: 'portfolio' })
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column()
  link: string;

  @OneToOne(() => FileEntity, (file) => file.website, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;
}
