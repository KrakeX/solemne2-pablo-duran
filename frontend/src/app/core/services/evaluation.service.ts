import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  CreateEvaluationDto,
  StudentEnrollmentDto,
  StudentEvaluationHistoryDto,
  TeacherSummaryDto,
  CourseSearchDto,
  ReportAvgByCareerDto,
  ReportAvgByTeacherDto,
  ReportDistributionDto,
} from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getStudents() {
    return this.http.get<Array<{ id: string; name: string; email: string }>>(`${this.baseUrl}/students`);
  }

  getStudentEnrollments(studentId: string, year: number, semester: number) {
    const params = new HttpParams().set('year', year).set('semester', semester);
    return this.http.get<StudentEnrollmentDto[]>(`${this.baseUrl}/students/${studentId}/enrollments`, { params });
  }

  getStudentEvaluations(studentId: string, year: number, semester: number) {
    const params = new HttpParams().set('year', year).set('semester', semester);
    return this.http.get<StudentEvaluationHistoryDto[]>(`${this.baseUrl}/students/${studentId}/evaluations`, { params });
  }

  submitEvaluation(dto: CreateEvaluationDto) {
    return this.http.post(`${this.baseUrl}/evaluations`, dto);
  }

  getTeachers(search?: string, year?: number, semester?: number) {
    let params = new HttpParams();
    if (search?.trim()) params = params.set('search', search.trim());
    if (year && semester) {
      params = params.set('year', year).set('semester', semester);
    }
    return this.http.get<TeacherSummaryDto[]>(`${this.baseUrl}/teachers`, { params });
  }

  searchCourses(opts: { search?: string; careerId?: string; year?: number; semester?: number }) {
    let params = new HttpParams();
    if (opts.search?.trim()) params = params.set('search', opts.search.trim());
    if (opts.careerId) params = params.set('careerId', opts.careerId);
    if (opts.year && opts.semester) params = params.set('year', opts.year).set('semester', opts.semester);
    return this.http.get<CourseSearchDto[]>(`${this.baseUrl}/courses`, { params });
  }

  reportAvgByCareer(year: number, semester: number) {
    const params = new HttpParams().set('year', year).set('semester', semester);
    return this.http.get<ReportAvgByCareerDto[]>(`${this.baseUrl}/reports/avg-by-career`, { params });
  }

  reportAvgByTeacher(year: number, semester: number, careerId?: string) {
    let params = new HttpParams().set('year', year).set('semester', semester);
    if (careerId) params = params.set('careerId', careerId);
    return this.http.get<ReportAvgByTeacherDto[]>(`${this.baseUrl}/reports/avg-by-teacher`, { params });
  }

  reportDistribution(year: number, semester: number, careerId?: string) {
    let params = new HttpParams().set('year', year).set('semester', semester);
    if (careerId) params = params.set('careerId', careerId);
    return this.http.get<ReportDistributionDto[]>(`${this.baseUrl}/reports/distribution`, { params });
  }
}
