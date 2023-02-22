import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'position' })
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'title',
  })
  title: string;

  @OneToMany(() => User, (user) => user.position)
  users: User;
}
