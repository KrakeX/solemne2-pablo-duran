import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing-module';
import { ReportsDashboard } from './pages/reports-dashboard/reports-dashboard';


@NgModule({
  declarations: [
    ReportsDashboard
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
