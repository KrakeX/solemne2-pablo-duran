import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CareersModule } from './modules/careers/careers.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [CareersModule, StudentsModule, TeachersModule, CoursesModule, PeriodsModule, EnrollmentsModule, EvaluationsModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
