import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OurService } from '../our-service/our-service.entity';

@Entity({ name: 'sub_service' })
export class SubService extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => OurService, (ourService) => ourService.subServices, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  ourService: OurService;
}
