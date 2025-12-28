import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Evaluation } from '../evaluations/evaluation.entity';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
