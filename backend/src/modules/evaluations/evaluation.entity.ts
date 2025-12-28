import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';

@Entity('evaluations')
@Unique(['enrollment'])
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Enrollment, { eager: true })
  @JoinColumn()
  enrollment: Enrollment;

  @Column('int')
  score: number;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
