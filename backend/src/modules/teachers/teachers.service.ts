import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Teacher } from './teacher.entity';



@Injectable()
export class TeachersService {
  constructor(@InjectRepository(Teacher) private readonly teachersRepo: Repository<Teacher>) {}

  async findAll(input: { search?: string; year?: number; semester?: number }) {
    const qb = this.teachersRepo
      .createQueryBuilder('t')
      .leftJoin('courses', 'c', 'c.teacherId = t.id')
      .leftJoin('enrollments', 'enr', 'enr.courseId = c.id')
      .leftJoin('periods', 'p', 'p.id = enr.periodId')
      .leftJoin('evaluations', 'ev', 'ev.enrollmentId = enr.id')
      .select('t.id', 'id')
      .addSelect('t.name', 'name')
      .addSelect('t.email', 'email')
      .addSelect('COALESCE(AVG(ev.score), 0)', 'avgScore')
      .addSelect('COUNT(ev.id)', 'evaluationsCount')
      .groupBy('t.id');

    if (input.search?.trim()) {
      qb.andWhere('(t.name ILIKE :s OR t.email ILIKE :s)', { s: `%${input.search.trim()}%` });
    }
    if (Number.isInteger(input.year) && Number.isInteger(input.semester)) {
      qb.andWhere('p.year = :year AND p.semester = :semester', {
        year: input.year,
        semester: input.semester,
      });
    }

    qb.orderBy('t.name', 'ASC');

    const rows = await qb.getRawMany();

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      avgScore: Number(r.avgScore),
      evaluationsCount: Number(r.evaluationsCount),
    }));
  }
}
