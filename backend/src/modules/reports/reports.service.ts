import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Evaluation } from '../evaluations/evaluation.entity';


@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Evaluation) private readonly evalRepo: Repository<Evaluation>) {}

  private validatePeriod(year: number, semester: number) {
    if (!Number.isInteger(year) || !Number.isInteger(semester)) {
      throw new BadRequestException('year y semester son requeridos y deben ser números');
    }
    if (![1, 2].includes(semester)) throw new BadRequestException('semester debe ser 1 o 2');
  }

  async avgByCareer(year: number, semester: number) {
    this.validatePeriod(year, semester);

    const rows = await this.evalRepo
      .createQueryBuilder('ev')
      .innerJoin('ev.enrollment', 'enr')
      .innerJoin('enr.period', 'p')
      .innerJoin('enr.course', 'c')
      .innerJoin('c.career', 'car')
      .select('car.id', 'careerId')
      .addSelect('car.name', 'careerName')
      .addSelect('AVG(ev.score)', 'avgScore')
      .addSelect('COUNT(ev.id)', 'evaluationsCount')
      .where('p.year = :year AND p.semester = :semester', { year, semester })
      .groupBy('car.id')
      .orderBy('car.name', 'ASC')
      .getRawMany();

    return rows.map((r) => ({
      careerId: r.careerId,
      careerName: r.careerName,
      avgScore: Number(r.avgScore),
      evaluationsCount: Number(r.evaluationsCount),
    }));
  }

  async avgByTeacher(year: number, semester: number, careerId?: string) {
    this.validatePeriod(year, semester);

    const qb = this.evalRepo
      .createQueryBuilder('ev')
      .innerJoin('ev.enrollment', 'enr')
      .innerJoin('enr.period', 'p')
      .innerJoin('enr.course', 'c')
      .innerJoin('c.teacher', 't')
      .innerJoin('c.career', 'car')
      .select('t.id', 'teacherId')
      .addSelect('t.name', 'teacherName')
      .addSelect('AVG(ev.score)', 'avgScore')
      .addSelect('COUNT(ev.id)', 'evaluationsCount')
      .where('p.year = :year AND p.semester = :semester', { year, semester });

    if (careerId) qb.andWhere('car.id = :careerId', { careerId });

    const rows = await qb
      .groupBy('t.id')
      .orderBy('t.name', 'ASC')
      .getRawMany();

    return rows.map((r) => ({
      teacherId: r.teacherId,
      teacherName: r.teacherName,
      avgScore: Number(r.avgScore),
      evaluationsCount: Number(r.evaluationsCount),
    }));
  }

  async distribution(year: number, semester: number, careerId?: string) {
    this.validatePeriod(year, semester);

    const qb = this.evalRepo
      .createQueryBuilder('ev')
      .innerJoin('ev.enrollment', 'enr')
      .innerJoin('enr.period', 'p')
      .innerJoin('enr.course', 'c')
      .innerJoin('c.career', 'car')
      .select('ev.score', 'score')
      .addSelect('COUNT(ev.id)', 'count')
      .where('p.year = :year AND p.semester = :semester', { year, semester });

    if (careerId) qb.andWhere('car.id = :careerId', { careerId });

    const rows = await qb.groupBy('ev.score').orderBy('ev.score', 'ASC').getRawMany();

    // Normaliza para tener siempre 1..7
    const map = new Map<number, number>();
    for (const r of rows) map.set(Number(r.score), Number(r.count));

    return Array.from({ length: 7 }, (_, i) => i + 1).map((score) => ({
      score,
      count: map.get(score) ?? 0,
    }));
  }
}
