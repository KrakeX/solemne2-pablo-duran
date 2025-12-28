import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Course } from '../courses/course.entity';
import { Period } from '../periods/period.entity';
import { Student } from '../students/student.entity';

@Entity('enrollments')
@Unique(['student', 'course', 'period'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { eager: true })
  student: Student;

  @ManyToOne(() => Course, { eager: true })
  course: Course;

  @ManyToOne(() => Period, { eager: true })
  period: Period;
}
