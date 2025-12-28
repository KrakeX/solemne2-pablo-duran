import { Controller, Get, Query } from '@nestjs/common';

import { CareersService } from './carreers.service';


@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.careersService.findAll(search);
  }
}
