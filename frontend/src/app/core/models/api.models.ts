export interface CareerDto {
  id: string;
  name: string;
}

export interface PeriodDto {
  id: string;
  year: number;
  semester: number;
}

export interface TeacherSummaryDto {
  id: string;
  name: string;
  email: string;
  avgScore: number;
  evaluationsCount: number;
}

export interface EnrollmentCourseDto {
  id: string;
  code: string;
  name: string;
  career: CareerDto;
  teacher: { id: string; name: string };
}

export interface StudentEnrollmentDto {
  enrollmentId: string;
  period: { year: number; semester: number };
  course: EnrollmentCourseDto;
  evaluated: boolean;
  evaluation: null | {
    id: string;
    score: number;
    comment: string;
    createdAt: string;
  };
}

export interface StudentEvaluationHistoryDto {
  evaluationId: string;
  createdAt: string;
  score: number;
  comment: string;
  period: { year: number; semester: number };
  course: EnrollmentCourseDto;
  enrollmentId: string;
}

export interface CreateEvaluationDto {
  enrollmentId: string;
  score: number;
  comment: string;
}

export interface CourseSearchDto {
  id: string;
  code: string;
  name: string;
  teacher: { id: string; name: string };
  career: CareerDto;
  avgScore: number;
  evaluationsCount: number;
}

export interface ReportAvgByCareerDto {
  careerId: string;
  careerName: string;
  avgScore: number;
  evaluationsCount: number;
}

export interface ReportAvgByTeacherDto {
  teacherId: string;
  teacherName: string;
  avgScore: number;
  evaluationsCount: number;
}

export interface ReportDistributionDto {
  score: number;
  count: number;
}
