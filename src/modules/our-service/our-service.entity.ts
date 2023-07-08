import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { SubService } from '../sub-service/sub-service.entity';

@Entity({ name: 'our_service' })
export class OurService extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => SubService, (subService) => subService.ourService)
  subServices: SubService[];
}
