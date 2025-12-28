import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { PeriodDto, StudentEnrollmentDto } from '../../../../core/models/api.models';
import { CatalogService } from '../../../../core/services/catalog.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-my-courses',
  standalone: false,
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit, OnDestroy {
  periods: PeriodDto[] = [];
  selectedPeriodKey: string | null = null;

  enrollments: StudentEnrollmentDto[] = [];
  pendingCount = 0;

  loading = false;
  error: string | null = null;

  selectedEvaluation: StudentEnrollmentDto | null = null;

  private sub = new Subscription();
  private currentStudentId: string | null = null;

  constructor(
    private readonly catalogService: CatalogService,
    private readonly evaluationService: EvaluationService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // Carga inicial: periods + studentId demo
    this.sub.add(
      combineLatest([this.catalogService.getPeriods(), this.sessionService.studentId$]).subscribe({
        next: ([periods, studentId]) => {
          this.periods = periods;
          this.currentStudentId = studentId;

          if (!this.selectedPeriodKey && this.periods.length > 0) {
            // primer periodo (viene ordenado desc en el backend)
            const p = this.periods[0];
            this.selectedPeriodKey = this.periodKey(p.year, p.semester);
          }

          this.reload();
        },
        error: (err) => {
          this.error = this.getErrorMessage(err);
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  periodKey(year: number, semester: number) {
    return `${year}-${semester}`;
  }

  onPeriodChange(ev: Event) {
    const value = (ev.target as HTMLSelectElement).value;
    this.selectedPeriodKey = value;
    this.selectedEvaluation = null;
    this.reload();
  }

  reload() {
    if (!this.currentStudentId) {
      this.error = 'No se pudo resolver el estudiante demo.';
      return;
    }
    if (!this.selectedPeriodKey) return;

    const [yearStr, semesterStr] = this.selectedPeriodKey.split('-');
    const year = Number(yearStr);
    const semester = Number(semesterStr);

    this.loading = true;
    this.error = null;

    this.sub.add(
      this.evaluationService.getStudentEnrollments(this.currentStudentId, year, semester).subscribe({
        next: (rows) => {
          this.enrollments = rows;
          this.pendingCount = rows.filter((r) => !r.evaluated).length;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = this.getErrorMessage(err);
        },
      }),
    );
  }

  goEvaluate(enrollmentId: string) {
    this.router.navigate(['/evaluation', enrollmentId]);
  }

  viewEvaluation(e: StudentEnrollmentDto) {
    this.selectedEvaluation = e;
  }

  private getErrorMessage(err: any): string {
    // Manejo simple de error Http
    return err?.error?.message?.toString?.() ?? 'Error inesperado consultando la API.';
  }
}
