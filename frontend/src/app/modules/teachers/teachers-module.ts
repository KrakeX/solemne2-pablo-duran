import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing-module';
import { TeachersList } from './pages/teachers-list/teachers-list';


@NgModule({
  declarations: [
    TeachersList
  ],
  imports: [
    CommonModule,
    TeachersRoutingModule
  ]
})
export class TeachersModule { }
