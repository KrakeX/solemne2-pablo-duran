import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Period } from './period.entity';


@Injectable()
export class PeriodsService {
  constructor(@InjectRepository(Period) private readonly periodsRepo: Repository<Period>) {}

  async findAll() {
    return this.periodsRepo.find({
      order: { year: 'DESC', semester: 'DESC' },
    });
  }
}
