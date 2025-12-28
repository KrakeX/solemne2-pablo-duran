import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import type { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { StudentEnrollmentDto } from '../../../../core/models/api.models';
import { EvaluationService } from '../../../../core/services/evaluation.service';

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

  form: FormGroup;

  private sub = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly evalService: EvaluationService,
  ) {
    this.form = this.fb.group({
      score: [null as number | null, [Validators.required, Validators.min(1), Validators.max(7)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.enrollmentId = this.route.snapshot.paramMap.get('enrollmentId')!;
    this.loading = true;

    this.sub.add(
      this.evalService.getEnrollmentById(this.enrollmentId).subscribe({
        next: (enrollment) => {
          this.enrollment = enrollment;

          if (enrollment.evaluated) {
            this.form.disable();
            this.form.patchValue({
              score: enrollment.evaluation?.score ?? null,
              comment: enrollment.evaluation?.comment ?? '',
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

  submit() {
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

  private getErrorMessage(err: any): string {
    const msg = err?.error?.message ?? err?.message ?? 'Error inesperado.';
    if (Array.isArray(msg)) return msg.join(', ');
    return String(msg);
  }
}
