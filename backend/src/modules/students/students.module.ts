import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';
import { Period } from '../periods/period.entity';

import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Enrollment, Period])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
