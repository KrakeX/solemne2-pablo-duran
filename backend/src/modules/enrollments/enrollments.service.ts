import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Enrollment } from './enrollment.entity';



@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private readonly enrollmentsRepo: Repository<Enrollment>,
  ) {}

  async findOne(enrollmentId: string) {
    const enr = await this.enrollmentsRepo
      .createQueryBuilder('enr')
      .leftJoinAndSelect('enr.student', 'student')
      .leftJoinAndSelect('enr.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.career', 'career')
      .leftJoinAndSelect('enr.period', 'period')
      .leftJoinAndSelect('enr.evaluation', 'evaluation')
      .where('enr.id = :enrollmentId', { enrollmentId })
      .getOne();

    if (!enr) throw new NotFoundException('Enrollment no encontrado');

    // Mismo shape que usamos en /students/:id/enrollments para reusar DTOs del front
    return {
      enrollmentId: enr.id,
      period: { year: enr.period.year, semester: enr.period.semester },
      course: {
        id: enr.course.id,
        code: enr.course.code,
        name: enr.course.name,
        career: { id: enr.course.career.id, name: enr.course.career.name },
        teacher: { id: enr.course.teacher.id, name: enr.course.teacher.name },
      },
      evaluated: !!enr.evaluation,
      evaluation: enr.evaluation
        ? {
            id: enr.evaluation.id,
            score: enr.evaluation.score,
            comment: enr.evaluation.comment,
            createdAt: enr.evaluation.createdAt,
          }
        : null,
    };
  }
}
