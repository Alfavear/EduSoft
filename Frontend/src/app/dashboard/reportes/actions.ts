"use server";

import { prisma } from "@/lib/prisma";

export async function getExcellenceReport() {
  const students = await prisma.student.findMany({
    include: {
      grades: true,
      course: true
    }
  });

  return students.map(s => {
    const avg = s.grades.length > 0 
      ? s.grades.reduce((acc, g) => acc + parseFloat(g.value), 0) / s.grades.length 
      : 0;
    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      course: s.course.name,
      average: avg
    };
  }).filter(s => s.average >= 4.5).sort((a, b) => b.average - a.average);
}

export async function getAttendanceWarningReport() {
  const students = await prisma.student.findMany({
    include: {
      attendances: true,
      course: true
    }
  });

  return students.map(s => {
    const totalDays = s.attendances.length;
    const absences = s.attendances.filter(a => a.status === 'ABSENT').length;
    const rate = totalDays > 0 ? (absences / totalDays) * 100 : 0;
    
    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      course: s.course.name,
      absenceCount: absences,
      absenceRate: rate
    };
  }).filter(s => s.absenceRate >= 15).sort((a, b) => b.absenceRate - a.absenceRate);
}

export async function getConsolidatedCourseReport(courseId: string) {
  const [course, students, subjects] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId } }),
    prisma.student.findMany({ 
      where: { courseId },
      include: { grades: { include: { assignment: { include: { subject: true } } } } }
    }),
    prisma.subject.findMany({
      where: { assignments: { some: { courseId } } }
    })
  ]);

  const reportData = students.map(s => {
    const subjectGrades: Record<string, string> = {};
    subjects.forEach(sub => {
      const grade = s.grades.find(g => g.assignment.subjectId === sub.id);
      subjectGrades[sub.id] = grade ? grade.value : "-";
    });

    const numericGrades = s.grades.map(g => parseFloat(g.value)).filter(v => !isNaN(v));
    const average = numericGrades.length > 0 
      ? numericGrades.reduce((acc, v) => acc + v, 0) / numericGrades.length 
      : 0;

    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      grades: subjectGrades,
      average: average.toFixed(2)
    };
  });

  return {
    courseName: course?.name,
    subjects,
    data: reportData
  };
}

export async function getStudentsForReports() {
  return await prisma.student.findMany({
    include: { course: true },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
  });
}

export async function getActivePeriodsForReports() {
  const year = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: { periods: { orderBy: { createdAt: 'asc' } } }
  });
  return year?.periods || [];
}

export async function getAssignmentsForReports() {
  return await prisma.teacherAssignment.findMany({
    include: { teacher: true, course: true, subject: true },
    orderBy: { courseId: 'asc' }
  });
}
