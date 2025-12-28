import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing-module';
import { MyCourses } from './pages/my-courses/my-courses';
import { EvaluateCourse } from './pages/evaluate-course/evaluate-course';


@NgModule({
  declarations: [
    MyCourses,
    EvaluateCourse
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule
  ]
})
export class EvaluationModule { }
