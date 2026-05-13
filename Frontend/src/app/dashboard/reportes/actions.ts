"use server";

import { prisma } from "@/lib/prisma";
import { getPerformanceLevel, isPassed, calculateAverage } from "@/lib/gradingUtils";

export async function getInstitutionalInfo() {
  return await prisma.schoolInfo.findFirst();
}


/**
 * Calcula el escalafón (puestos) de un curso para un periodo específico.
 * El puesto se basa en el promedio general de todas las asignaturas.
 */
export async function calculateCourseRankings(courseId: string, periodId: string) {
  const students = await prisma.student.findMany({
    where: { courseId },
    include: {
      grades: {
        where: { periodId }
      }
    }
  });

  const studentAverages = students.map(student => {
    const grades = student.grades.map(g => parseFloat(g.value) || 0);
    const average = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    return {
      studentId: student.id,
      fullName: `${student.firstName} ${student.lastName}`,
      average
    };
  });

  // Ordenar por promedio de mayor a menor
  const sorted = studentAverages.sort((a, b) => b.average - a.average);

  // Asignar puestos (considerando empates si se desea, aquí simple)
  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Obtiene los datos completos para el boletín de un estudiante.
 */
export async function getStudentReportData(studentId: string, periodId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      course: {
        include: {
          assignments: {
            include: {
              subject: {
                include: {
                  indicators: {
                    where: { periodId }
                  }
                }
              }
            }
          }
        }
      },
      grades: {
        where: { periodId },
        include: {
          assignment: {
            include: { subject: true }
          }
        }
      }
    }
  });

  if (!student) return null;

  // Organizar datos por área (Subject)
  const subjectsData = student.course.assignments.map(as => {
    const grade = student.grades.find(g => g.assignmentId === as.id);
    const numericValue = grade ? parseFloat(grade.value) || 0 : 0;
    
    // Determinar nivel de desempeño
    let level = "Bajo";
    if (numericValue >= 4.6) level = "Superior";
    else if (numericValue >= 4.0) level = "Alto";
    else if (numericValue >= 3.0) level = "Básico";

    // Buscar indicador para ese nivel
    const indicator = as.subject.indicators.find(ind => ind.performanceLevel === level);

    return {
      name: as.subject.name,
      intensity: as.subject.weeklyHours || 0,
      grade: numericValue,
      performanceLevel: level,
      description: indicator?.description || ""
    };
  });

  // Calcular puesto
  const rankings = await calculateCourseRankings(student.courseId, periodId);
  const myRank = rankings.find(r => r.studentId === studentId)?.rank || 0;

  return {
    student,
    subjects: subjectsData,
    rank: myRank,
    totalStudents: rankings.length,
    overallAverage: subjectsData.reduce((acc, s) => acc + s.grade, 0) / subjectsData.length
  };
}

/**
 * Gestión de Indicadores
 */
export async function upsertIndicator(data: { subjectId: string; periodId: string; performanceLevel: string; description: string }) {
  return await prisma.indicator.upsert({
    where: {
      subjectId_periodId_performanceLevel: {
        subjectId: data.subjectId,
        periodId: data.periodId,
        performanceLevel: data.performanceLevel
      }
    },
    update: { description: data.description },
    create: data
  });
}
