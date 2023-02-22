import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

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
}
