import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFound } from './pages/not-found/not-found';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'evaluation' },

  {
    path: 'evaluation',
    loadChildren: () =>
      import('./modules/evaluation/evaluation.module').then((m) => m.EvaluationModule),
  },
  {
    path: 'teachers',
    loadChildren: () =>
      import('./modules/teachers/teachers-module').then((m) => m.TeachersModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./modules/reports/reports-module').then((m) => m.ReportsModule),
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./modules/history/history-module').then((m) => m.HistoryModule),
  },

  { path: '**', component: NotFound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
