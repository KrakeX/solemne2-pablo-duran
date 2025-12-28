import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EvaluationRoutingModule } from './evaluation-routing-module';

import { EvaluateCourse } from './pages/evaluate-course/evaluate-course';
import { MyCourses } from './pages/my-courses/my-courses';

const routes: Routes = [
  { path: '', component: MyCourses },
  { path: ':enrollmentId', component: EvaluateCourse },
];

@NgModule({
  declarations: [
    MyCourses,
    EvaluateCourse
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    EvaluationRoutingModule
  ]
})
export class EvaluationModule { }
