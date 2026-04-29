"use server";

import { prisma } from "@/lib/prisma";
import { getSchoolInfo } from "./configuracion/schoolActions";

export async function getDashboardData() {
  const [stats, schoolInfo] = await Promise.all([
    prisma.$transaction([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.course.count(),
    ]),
    getSchoolInfo()
  ]);

  const threshold = schoolInfo.alertThreshold || 3.0;

  // Obtener estudiantes con promedio bajo el umbral (Alerta Temprana)
  // Simplificación: Estudiantes con CUALQUIER nota bajo el umbral en el periodo activo
  const studentsAtRisk = await prisma.student.findMany({
    where: {
      grades: {
        some: {
          value: {
            lt: threshold.toString() // Nota: value es String en el esquema original
          }
        }
      }
    },
    include: {
      grades: {
        orderBy: { updatedAt: 'desc' },
        take: 5
      },
      course: true
    },
    take: 10
  });

  return {
    studentCount: stats[0],
    teacherCount: stats[1],
    courseCount: stats[2],
    alertThreshold: threshold,
    studentsAtRisk: studentsAtRisk.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      course: s.course.name,
      // Calculamos promedio de sus notas registradas
      average: s.grades.length > 0 
        ? s.grades.reduce((acc, g) => acc + parseFloat(g.value), 0) / s.grades.length 
        : 0
    })).filter(s => s.average < threshold && s.average > 0)
  };
}

export async function getTeacherDashboardData(userId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: {
      assignments: {
        include: {
          course: true,
          subject: true,
          _count: { select: { grades: true } }
        }
      }
    }
  });

  return {
    assignmentsCount: teacher?.assignments.length || 0,
    assignments: teacher?.assignments.map(a => ({
      id: a.id,
      course: a.course.name,
      subject: a.subject.name,
      courseId: a.courseId
    })) || []
  };
}

export async function getStudentDashboardData(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      grades: {
        include: {
          assignment: { include: { subject: true } }
        }
      }
    }
  });

  const average = student?.grades.length 
    ? student.grades.reduce((acc, g) => acc + parseFloat(g.value), 0) / student.grades.length 
    : 0;

  return {
    average: average.toFixed(2),
    subjectsCount: student?.grades.length || 0,
    recentGrades: student?.grades.map(g => ({
      subject: g.assignment.subject.name,
      value: g.value
    })) || []
  };
}
