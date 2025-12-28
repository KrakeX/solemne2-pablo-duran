import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Career } from '../careers/career.entity';
import { Teacher } from '../teachers/teacher.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @ManyToOne(() => Career, { eager: true })
  career: Career;

  @ManyToOne(() => Teacher, { eager: true })
  teacher: Teacher;
}
