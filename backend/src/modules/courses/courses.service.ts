import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brackets, Repository } from 'typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';
import { Evaluation } from '../evaluations/evaluation.entity';
import { Period } from '../periods/period.entity';

import { Course } from './course.entity';


@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly coursesRepo: Repository<Course>,
  ) {}

  async search(input: {
    search?: string;
    careerId?: string;
    year?: number;
    semester?: number;
  }) {
    const search = input.search?.trim();
    const careerId = input.careerId?.trim();
    const year = input.year;
    const semester = input.semester;

    if ((year && !semester) || (!year && semester)) {
      throw new BadRequestException('year y semester deben venir juntos');
    }
    if (semester && ![1, 2].includes(semester)) {
      throw new BadRequestException('semester debe ser 1 o 2');
    }

    // Base: cursos + docente + carrera
    const qb = this.coursesRepo
      .createQueryBuilder('c')
      .leftJoin('c.teacher', 't')
      .leftJoin('c.career', 'car')
      .select('c.id', 'id')
      .addSelect('c.code', 'code')
      .addSelect('c.name', 'name')
      .addSelect('t.id', 'teacherId')
      .addSelect('t.name', 'teacherName')
      .addSelect('car.id', 'careerId')
      .addSelect('car.name', 'careerName');

    // Para promedio por curso: join “manual” a enrollments/periods/evaluations
    // (así no dependemos de tener OneToMany en Course)
    qb.leftJoin(Enrollment, 'enr', 'enr."courseId" = c.id');

    // Si viene periodo, lo aplicamos en el JOIN para que no “mate” cursos sin evaluaciones
    if (year && semester) {
      qb.leftJoin(
        Period,
        'p',
        'p.id = enr."periodId" AND p.year = :year AND p.semester = :semester',
        { year, semester },
      );
      qb.leftJoin(Evaluation, 'ev', 'ev."enrollmentId" = enr.id');
    } else {
      qb.leftJoin(Period, 'p', 'p.id = enr."periodId"');
      qb.leftJoin(Evaluation, 'ev', 'ev."enrollmentId" = enr.id');
    }

    qb.addSelect('COALESCE(AVG(ev.score), 0)', 'avgScore')
      .addSelect('COUNT(ev.id)', 'evaluationsCount');

    // Filtros
    if (careerId) {
      qb.andWhere('car.id = :careerId', { careerId });
    }

    if (search) {
      qb.andWhere(
        new Brackets((w) => {
          w.where('c.code ILIKE :s', { s: `%${search}%` })
            .orWhere('c.name ILIKE :s', { s: `%${search}%` })
            .orWhere('t.name ILIKE :s', { s: `%${search}%` });
        }),
      );
    }

    qb.groupBy('c.id')
      .addGroupBy('t.id')
      .addGroupBy('car.id')
      .orderBy('c.code', 'ASC');

    const rows = await qb.getRawMany();

    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      teacher: { id: r.teacherId, name: r.teacherName },
      career: { id: r.careerId, name: r.careerName },
      avgScore: Number(r.avgScore),
      evaluationsCount: Number(r.evaluationsCount),
    }));
  }
}
