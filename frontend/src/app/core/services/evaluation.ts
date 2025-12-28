import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getStudentEnrollments(studentId: string, year: number, semester: number) {
    const params = new HttpParams().set('year', year).set('semester', semester);
    return this.http.get(`${this.baseUrl}/students/${studentId}/enrollments`, { params });
  }

  submitEvaluation(payload: { enrollmentId: string; score: number; comment: string }) {
    return this.http.post(`${this.baseUrl}/evaluations`, payload);
  }

  getTeacherList(search?: string) {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get(`${this.baseUrl}/teachers`, { params });
  }

  getReports(filters: { year: number; semester: number; careerId?: string }) {
    let params = new HttpParams().set('year', filters.year).set('semester', filters.semester);
    if (filters.careerId) params = params.set('careerId', filters.careerId);
    return this.http.get(`${this.baseUrl}/reports/avg-by-career`, { params });
  }
}
