"use server";

import { prisma } from "@/lib/prisma";
import { getSchoolInfo } from "./configuracion/schoolActions";

export async function getDashboardData() {
  const [stats, schoolInfo, activeYear] = await Promise.all([
    prisma.$transaction([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.course.count(),
    ]),
    getSchoolInfo(),
    prisma.academicYear.findFirst({ where: { isActive: true }, include: { periods: true } })
  ]);

  const threshold = schoolInfo.alertThreshold || 3.0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Asistencia del día
  const attendanceToday = await prisma.attendance.findMany({
    where: { date: { gte: today } }
  });
  const attendanceRate = attendanceToday.length > 0 
    ? (attendanceToday.filter(a => a.status === 'PRESENT').length / attendanceToday.length) * 100 
    : 0;

  // 2. Estudiantes en Riesgo (Alerta Temprana)
  const studentsAtRisk = await prisma.student.findMany({
    where: {
      grades: {
        some: {
          value: { lt: threshold.toString() }
        }
      }
    },
    include: {
      grades: { orderBy: { updatedAt: 'desc' }, take: 10 },
      course: true
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    take: 5
  });

  const studentsAtRiskMapped = studentsAtRisk.map(s => {
    const avg = s.grades.length > 0 
      ? s.grades.reduce((acc, g) => acc + parseFloat(g.value), 0) / s.grades.length 
      : 0;
    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      course: s.course.name,
      average: avg
    };
  }).filter(s => s.average < threshold && s.average > 0);

  // 3. Cuadro de Excelencia (Top 5)
  const allStudents = await prisma.student.findMany({
    include: { grades: true, course: true },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
  });

  const excellenceTable = allStudents.map(s => {
    const avg = s.grades.length > 0 
      ? s.grades.reduce((acc, g) => acc + parseFloat(g.value), 0) / s.grades.length 
      : 0;
    return {
      name: `${s.firstName} ${s.lastName}`,
      course: s.course.name,
      average: avg
    };
  }).sort((a, b) => b.average - a.average).slice(0, 5);

  // 4. Materia Crítica
  const subjects = await prisma.subject.findMany({
    include: { assignments: { include: { grades: true } } }
  });

  let criticalSubject = { name: "N/A", average: 0 };
  let minAvg = 5.0;

  subjects.forEach(sub => {
    const allGrades = sub.assignments.flatMap(a => a.grades);
    if (allGrades.length > 0) {
      const avg = allGrades.reduce((acc, g) => acc + parseFloat(g.value), 0) / allGrades.length;
      if (avg < minAvg) {
        minAvg = avg;
        criticalSubject = { name: sub.name, average: avg };
      }
    }
  });

  return {
    studentCount: stats[0],
    teacherCount: stats[1],
    courseCount: stats[2],
    attendanceRate: attendanceRate.toFixed(1),
    alertThreshold: threshold,
    studentsAtRisk: studentsAtRiskMapped,
    excellenceTable,
    criticalSubject,
    activePeriod: activeYear?.periods.find(p => p.status === 'OPEN')?.name || "Sin periodo activo"
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
