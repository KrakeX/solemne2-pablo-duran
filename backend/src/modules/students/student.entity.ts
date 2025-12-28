import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Career } from '../careers/career.entity';



@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Career, { eager: true })
  career: Career;
}
