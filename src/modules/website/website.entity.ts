import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { FileEntity } from '../file/file.entity';

@Entity({ name: 'website' })
export class Website extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column({ default: 0 })
  like: number;

  @Column()
  link: string;

  @OneToOne(() => FileEntity, (file) => file.website)
  @JoinColumn()
  avatar: FileEntity;
}
