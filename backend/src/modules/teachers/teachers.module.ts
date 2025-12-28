import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from '../courses/course.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Evaluation } from '../evaluations/evaluation.entity';
import { Period } from '../periods/period.entity';

import { Teacher } from './teacher.entity';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Course, Enrollment, Evaluation, Period])],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
