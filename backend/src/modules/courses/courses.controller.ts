import { Controller, Get, Query } from '@nestjs/common';

import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  search(
    @Query('search') search?: string,
    @Query('careerId') careerId?: string,
    @Query('year') year?: string,
    @Query('semester') semester?: string,
  ) {
    return this.coursesService.search({
      search,
      careerId,
      year: year ? Number(year) : undefined,
      semester: semester ? Number(semester) : undefined,
    });
  }
}
