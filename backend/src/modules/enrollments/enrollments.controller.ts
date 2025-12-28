import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get(':enrollmentId')
  findOne(@Param('enrollmentId', new ParseUUIDPipe()) enrollmentId: string) {
    return this.enrollmentsService.findOne(enrollmentId);
  }
}
