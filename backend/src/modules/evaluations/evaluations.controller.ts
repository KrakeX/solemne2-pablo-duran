import { Body, Controller, Post } from '@nestjs/common';

import { EvaluationsService } from './evaluations.service';

import { CreateEvaluationDto } from './dto/create-evaluation.dto';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  create(@Body() dto: CreateEvaluationDto) {
    return this.evaluationsService.create(dto);
  }
}
