import { Injectable } from '@angular/core';

import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { EvaluationService } from './evaluation.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly studentId$;

  constructor(private readonly evalService: EvaluationService) {
    this.studentId$ = this.evalService.getStudents().pipe(
      map((students) => {
        const demo = students.find((s) => s.email === environment.demoStudentEmail);
        return demo?.id ?? students[0]?.id ?? null;
      }),
      shareReplay(1),
    );
  }
}
