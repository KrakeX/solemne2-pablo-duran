import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';
import { Evaluation } from '../evaluations/evaluation.entity';
import { Period } from '../periods/period.entity';

import { Course } from './course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Enrollment, Period, Evaluation])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
