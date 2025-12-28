import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { EvaluationRoutingModule } from './evaluation-routing-module';

import { EvaluateCourseComponent } from './pages/evaluate-course/evaluate-course.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';


const routes: Routes = [
  { path: '', component: MyCoursesComponent },
  { path: ':enrollmentId', component: EvaluateCourseComponent },
];

@NgModule({
  declarations: [
    MyCoursesComponent,
    EvaluateCourseComponent
    
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    EvaluationRoutingModule,
    ReactiveFormsModule,
  ]
})
export class EvaluationModule { }
