import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ILike, Repository } from 'typeorm';

import { Career } from './career.entity';


@Injectable()
export class CareersService {
  constructor(@InjectRepository(Career) private readonly careersRepo: Repository<Career>) {}

  async findAll(search?: string) {
    const s = search?.trim();

    return this.careersRepo.find({
      where: s ? { name: ILike(`%${s}%`) } : undefined,
      order: { name: 'ASC' },
    });
  }
}
