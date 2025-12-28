import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable, Subscription, combineLatest, switchMap } from 'rxjs';

import { PeriodDto, StudentEnrollmentDto } from '../../../../core/models/api.models';
import { CatalogService } from '../../../../core/services/catalog.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-evaluate-course',
  standalone: false,
  templateUrl: './evaluate-course.component.html',
  styleUrls: ['./evaluate-course.component.scss'],
})
export class EvaluateCourseComponent implements OnInit, OnDestroy {
  enrollmentId!: string;

  loading = false;
  submitting = false;
  success = false;
  error: string | null = null;

  enrollment: StudentEnrollmentDto | null = null;
  private periods: PeriodDto[] = [];
  private studentId: string | null = null;
  private sub = new Subscription();

  form!: ReturnType<typeof this.fb.group>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly evalService: EvaluationService,
    private readonly catalogService: CatalogService,
    private readonly sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      score: [null as number | null, [Validators.required, Validators.min(1), Validators.max(7)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.enrollmentId = this.route.snapshot.paramMap.get('enrollmentId')!;

    this.loading = true;

    // Traemos periods + studentId y luego buscamos el enrollment en el periodo más reciente.
    // (Como el enrollmentId es único, igual lo resolvemos desde el listado del periodo actual)
    this.sub.add(
      combineLatest([this.catalogService.getPeriods(), this.sessionService.studentId$])
        .pipe(
          switchMap(([periods, studentId]) => {
            this.periods = periods;
            this.studentId = studentId;

            if (!studentId) throw new Error('No se pudo resolver el estudiante demo');

            // Intentamos encontrar el enrollment recorriendo periodos (desc)
            return this.findEnrollmentBySearchingPeriods(studentId, periods);
          }),
        )
        .subscribe({
          next: (enrollment) => {
            this.enrollment = enrollment;

            if (enrollment?.evaluated) {
              // Si ya está evaluado, bloqueamos y mostramos info
              this.form.disable();
              this.form.patchValue({
                score: enrollment?.evaluation?.score ?? null,
                comment: enrollment?.evaluation?.comment ?? '',
              });
            }

            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.error = this.getErrorMessage(err);
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get score() {
    return this.form.controls['score'];
  }
  get comment() {
    return this.form.controls['comment'];
  }

  async submit() {
    if (!this.enrollment) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.success = false;
    this.error = null;

    const payload = {
      enrollmentId: this.enrollment.enrollmentId,
      score: Number(this.form.value.score),
      comment: String(this.form.value.comment ?? '').trim(),
    };

    this.sub.add(
      this.evalService.submitEvaluation(payload).subscribe({
        next: () => {
          this.submitting = false;
          this.success = true;

          // Volver a la lista después de un pequeño delay “natural”
          setTimeout(() => this.router.navigate(['/evaluation']), 600);
        },
        error: (err) => {
          this.submitting = false;
          this.error = this.getErrorMessage(err);
        },
      }),
    );
  }

  back() {
    this.router.navigate(['/evaluation']);
  }

  private findEnrollmentBySearchingPeriods(studentId: string, periods: PeriodDto[]): Observable<StudentEnrollmentDto> {
    // Buscamos en periodos en orden (ya vienen DESC desde API).
    // Implementación: consulta por periodo y busca el enrollmentId en el array.
    return new (class {
      constructor(private ctx: EvaluateCourseComponent) {}
      exec() {
        return this.ctx.searchInPeriods(studentId, periods, 0);
      }
    })(this).exec();
  }

  private searchInPeriods(studentId: string, periods: PeriodDto[], idx: number): Observable<StudentEnrollmentDto> {
    if (idx >= periods.length) {
      throw new Error('No se encontró el enrollment para este estudiante.');
    }
    const p = periods[idx];

    return this.evalService.getStudentEnrollments(studentId, p.year, p.semester).pipe(
      switchMap((rows) => {
        const found = rows.find((r) => r.enrollmentId === this.enrollmentId);
        if (found) {
          return [found];
        }
        return this.searchInPeriods(studentId, periods, idx + 1);
      }),
    );
  }

  private getErrorMessage(err: any): string {
    const msg = err?.error?.message ?? err?.message ?? 'Error inesperado.';
    if (Array.isArray(msg)) return msg.join(', ');
    return String(msg);
  }
}
