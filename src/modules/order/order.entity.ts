import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { FileEntity } from '../file/file.entity';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  company: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'NOW()' })
  date: string;

  @Column('boolean', { default: false })
  isActive: boolean = false;

  @OneToOne(() => FileEntity, (file) => file.article, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;
}
