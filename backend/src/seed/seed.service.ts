import { Injectable } from '@nestjs/common';

import { Career } from 'src/modules/careers/career.entity';
import { Course } from 'src/modules/courses/course.entity';
import { Enrollment } from 'src/modules/enrollments/enrollment.entity';
import { Period } from 'src/modules/periods/period.entity';
import { Student } from 'src/modules/students/student.entity';
import { Teacher } from 'src/modules/teachers/teacher.entity';

import { DataSource } from 'typeorm';



@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 1) Carreras
      const careersData = [
        { name: 'Ingeniería en Informática' },
        { name: 'Administración' },
        { name: 'Psicología' },
      ];

      const careers: Record<string, Career> = {};
      for (const c of careersData) {
        let career = await manager.findOne(Career, { where: { name: c.name } });
        if (!career) {
          career = manager.create(Career, c);
          career = await manager.save(Career, career);
        }
        careers[c.name] = career;
      }

      // 2) Docentes
      const teachersData = [
        { name: 'María Pérez', email: 'maria.perez@campuslibre.cl' },
        { name: 'Juan Soto', email: 'juan.soto@campuslibre.cl' },
        { name: 'Camila Rojas', email: 'camila.rojas@campuslibre.cl' },
      ];

      const teachers: Record<string, Teacher> = {};
      for (const t of teachersData) {
        let teacher = await manager.findOne(Teacher, { where: { email: t.email } });
        if (!teacher) {
          teacher = manager.create(Teacher, t);
          teacher = await manager.save(Teacher, teacher);
        }
        teachers[t.email] = teacher;
      }

      // 3) Cursos
      const coursesData = [
        {
          code: 'INF-101',
          name: 'Programación I',
          careerName: 'Ingeniería en Informática',
          teacherEmail: 'maria.perez@campuslibre.cl',
        },
        {
          code: 'INF-201',
          name: 'Bases de Datos',
          careerName: 'Ingeniería en Informática',
          teacherEmail: 'juan.soto@campuslibre.cl',
        },
        {
          code: 'ADM-110',
          name: 'Contabilidad Básica',
          careerName: 'Administración',
          teacherEmail: 'camila.rojas@campuslibre.cl',
        },
      ];

      const courses: Record<string, Course> = {};
      for (const c of coursesData) {
        let course = await manager.findOne(Course, { where: { code: c.code } });
        if (!course) {
          course = manager.create(Course, {
            code: c.code,
            name: c.name,
            career: careers[c.careerName],
            teacher: teachers[c.teacherEmail],
          });
          course = await manager.save(Course, course);
        }
        courses[c.code] = course;
      }

      // 4) Estudiantes, los nombres utilizados son ficticios (sólo el mío es real)
      const studentsData = [
        {
          name: 'Pablo Durán',
          email: 'pablo.duran@alumnos.campuslibre.cl',
          careerName: 'Ingeniería en Informática',
        },
        {
          name: 'Valentina Muñoz',
          email: 'valentina.munoz@alumnos.campuslibre.cl',
          careerName: 'Administración',
        },
      ];

      const students: Record<string, Student> = {};
      for (const s of studentsData) {
        let student = await manager.findOne(Student, { where: { email: s.email } });
        if (!student) {
          student = manager.create(Student, {
            name: s.name,
            email: s.email,
            career: careers[s.careerName],
          });
          student = await manager.save(Student, student);
        }
        students[s.email] = student;
      }

      // 5) Periodos
      const periodsData = [
        { year: 2025, semester: 2 },
        { year: 2025, semester: 1 },
      ];

      const periods: Record<string, Period> = {};
      for (const p of periodsData) {
        let period = await manager.findOne(Period, { where: { year: p.year, semester: p.semester } });
        if (!period) {
          period = manager.create(Period, p);
          period = await manager.save(Period, period);
        }
        periods[`${p.year}-${p.semester}`] = period;
      }

      // 6) Inscripciones (Enrollments)
      const enrollmentsData = [
        {
          studentEmail: 'pablo.duran@alumnos.campuslibre.cl',
          courseCode: 'INF-101',
          periodKey: '2025-2',
        },
        {
          studentEmail: 'pablo.duran@alumnos.campuslibre.cl',
          courseCode: 'INF-201',
          periodKey: '2025-2',
        },
        {
          studentEmail: 'valentina.munoz@alumnos.campuslibre.cl',
          courseCode: 'ADM-110',
          periodKey: '2025-2',
        },
      ];

      for (const e of enrollmentsData) {
        const student = students[e.studentEmail];
        const course = courses[e.courseCode];
        const period = periods[e.periodKey];

        const existing = await manager.findOne(Enrollment, {
          where: {
            student: { id: student.id },
            course: { id: course.id },
            period: { id: period.id },
          },
        });

        if (!existing) {
          const enrollment = manager.create(Enrollment, { student, course, period });
          await manager.save(Enrollment, enrollment);
        }
      }
    });

    // Log final fuera de la transacción
    // (si quieres, lo dejamos silencioso)
    // eslint-disable-next-line no-console
    console.log('Seed OK: careers, teachers, courses, students, periods, enrollments');
  }
}
