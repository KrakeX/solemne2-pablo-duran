import { Controller, Get, Query } from '@nestjs/common';

import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('year') year?: string,
    @Query('semester') semester?: string,
  ) {
    const y = year ? Number(year) : undefined;
    const s = semester ? Number(semester) : undefined;
    return this.teachersService.findAll({ search, year: y, semester: s });
  }
}
