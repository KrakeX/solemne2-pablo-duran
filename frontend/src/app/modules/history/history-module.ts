import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing-module';
import { HistoryList } from './pages/history-list/history-list';


@NgModule({
  declarations: [
    HistoryList
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
