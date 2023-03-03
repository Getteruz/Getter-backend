import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { FileEntity } from '../file/file.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'website' })
export class Website extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column()
  link: string;

  @Column({default:0})
  likesCount:number

  @ManyToMany(() => User, (user) => user.websiteLikes, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: User[];

  @Column({ default: false })
  isActive: boolean;

  @OneToOne(() => FileEntity, (file) => file.website, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: FileEntity;
}
