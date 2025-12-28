import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';

import { Evaluation } from './evaluation.entity';

import { CreateEvaluationDto } from './dto/create-evaluation.dto';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation) private readonly evalRepo: Repository<Evaluation>,
    @InjectRepository(Enrollment) private readonly enrRepo: Repository<Enrollment>,
  ) {}

  async create(dto: CreateEvaluationDto) {
    const enrollment = await this.enrRepo.findOne({
      where: { id: dto.enrollmentId },
      relations: { evaluation: true },
    });

    if (!enrollment) throw new NotFoundException('Enrollment no encontrado');
    if (enrollment.evaluation) throw new ConflictException('Este curso ya fue evaluado');

    const evaluation = this.evalRepo.create({
      enrollment,
      score: dto.score,
      comment: dto.comment.trim(),
    });

    return this.evalRepo.save(evaluation);
  }
}
