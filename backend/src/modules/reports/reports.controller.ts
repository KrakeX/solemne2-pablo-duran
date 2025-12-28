import { Controller, Get, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('avg-by-career')
  avgByCareer(@Query('year') year: string, @Query('semester') semester: string) {
    return this.reportsService.avgByCareer(Number(year), Number(semester));
  }

  @Get('avg-by-teacher')
  avgByTeacher(
    @Query('year') year: string,
    @Query('semester') semester: string,
    @Query('careerId') careerId?: string,
  ) {
    return this.reportsService.avgByTeacher(Number(year), Number(semester), careerId);
  }

  @Get('distribution')
  distribution(
    @Query('year') year: string,
    @Query('semester') semester: string,
    @Query('careerId') careerId?: string,
  ) {
    return this.reportsService.distribution(Number(year), Number(semester), careerId);
  }
}
