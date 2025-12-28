import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':studentId/enrollments')
  getEnrollments(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
    @Query('year') year: string,
    @Query('semester') semester: string,
  ) {
    return this.studentsService.getEnrollmentsByPeriod({
      studentId,
      year: Number(year),
      semester: Number(semester),
    });
  }
}
