import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { EvaluationRoutingModule } from './evaluation-routing-module';

import { EvaluateCourse } from './pages/evaluate-course/evaluate-course';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';


const routes: Routes = [
  { path: '', component: MyCoursesComponent },
  { path: ':enrollmentId', component: EvaluateCourse },
];

@NgModule({
  declarations: [
    EvaluateCourse
  ],
  imports: [
    RouterModule.forChild(routes),
    MyCoursesComponent,
    CommonModule,
    EvaluationRoutingModule,
    ReactiveFormsModule,
  ]
})
export class EvaluationModule { }
