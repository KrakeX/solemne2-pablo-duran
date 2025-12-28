import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';
import { Period } from '../periods/period.entity';

import { Student } from './student.entity';



@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Enrollment) private readonly enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Period) private readonly periodsRepo: Repository<Period>,
  ) {}

  async findAll() {
    return this.studentsRepo.find({
      order: { name: 'ASC' },
    });
  }

  async getEnrollmentsByPeriod(input: { studentId: string; year: number; semester: number }) {
    const { studentId, year, semester } = input;

    if (!Number.isInteger(year) || !Number.isInteger(semester)) {
      throw new BadRequestException('year y semester son requeridos y deben ser números');
    }
    if (![1, 2].includes(semester)) {
      throw new BadRequestException('semester debe ser 1 o 2');
    }

    const student = await this.studentsRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student no encontrado');

    const period = await this.periodsRepo.findOne({ where: { year, semester } });
    if (!period) throw new NotFoundException('Periodo no encontrado');

    // Enrollment ya trae student/course/period eager (según nuestras entidades).
    // Hacemos left join a evaluation para saber si está evaluado.
    const enrollments = await this.enrollmentsRepo
      .createQueryBuilder('enr')
      .leftJoinAndSelect('enr.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.career', 'career')
      .leftJoinAndSelect('enr.period', 'period')
      .leftJoinAndSelect('enr.evaluation', 'evaluation')
      .where('enr.student.id = :studentId', { studentId })
      .andWhere('period.year = :year', { year })
      .andWhere('period.semester = :semester', { semester })
      .orderBy('course.code', 'ASC')
      .getMany();

    return enrollments.map((e) => ({
      enrollmentId: e.id,
      period: { year: e.period.year, semester: e.period.semester },
      course: {
        id: e.course.id,
        code: e.course.code,
        name: e.course.name,
        career: { id: e.course.career.id, name: e.course.career.name },
        teacher: { id: e.course.teacher.id, name: e.course.teacher.name },
      },
      evaluated: !!e.evaluation,
      evaluation: e.evaluation
        ? { id: e.evaluation.id, score: e.evaluation.score, comment: e.evaluation.comment, createdAt: e.evaluation.createdAt }
        : null,
    }));
  }

  async getEvaluationsByPeriod(input: { studentId: string; year: number; semester: number }) {
    const { studentId, year, semester } = input;

    if (!Number.isInteger(year) || !Number.isInteger(semester)) {
      throw new BadRequestException('year y semester son requeridos y deben ser números');
    }
    if (![1, 2].includes(semester)) throw new BadRequestException('semester debe ser 1 o 2');

    const student = await this.studentsRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student no encontrado');

    const period = await this.periodsRepo.findOne({ where: { year, semester } });
    if (!period) throw new NotFoundException('Periodo no encontrado');

    // Solo enrollments que ya tienen evaluación (histórico)
    const enrollmentsWithEval = await this.enrollmentsRepo
      .createQueryBuilder('enr')
      .innerJoinAndSelect('enr.evaluation', 'evaluation') // inner join => solo evaluados
      .leftJoinAndSelect('enr.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.career', 'career')
      .leftJoinAndSelect('enr.period', 'period')
      .where('enr.student.id = :studentId', { studentId })
      .andWhere('period.year = :year', { year })
      .andWhere('period.semester = :semester', { semester })
      .orderBy('evaluation.createdAt', 'DESC')
      .getMany();

    return enrollmentsWithEval.map((e) => ({
      evaluationId: e.evaluation!.id,
      createdAt: e.evaluation!.createdAt,
      score: e.evaluation!.score,
      comment: e.evaluation!.comment,
      period: { year: e.period.year, semester: e.period.semester },
      course: {
        id: e.course.id,
        code: e.course.code,
        name: e.course.name,
        career: { id: e.course.career.id, name: e.course.career.name },
        teacher: { id: e.course.teacher.id, name: e.course.teacher.name },
      },
      enrollmentId: e.id,
    }));
  }
}
