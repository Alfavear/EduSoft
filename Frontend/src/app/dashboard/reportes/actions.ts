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

/**
 * Obtiene los periodos activos para los reportes.
 */
export async function getActivePeriodsForReports() {
  return await prisma.academicPeriod.findMany({
    where: { status: "OPEN" },
    orderBy: { name: 'asc' }
  });
}

/**
 * Obtiene la lista de estudiantes para los reportes.
 */
export async function getStudentsForReports() {
  return await prisma.student.findMany({
    include: { course: true },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
  });
}

/**
 * Obtiene las asignaciones docentes para reportes.
 */
export async function getAssignmentsForReports() {
  return await prisma.teacherAssignment.findMany({
    include: {
      subject: true,
      course: true,
      teacher: true
    }
  });
}

/**
 * Obtiene el reporte de advertencia de asistencia.
 */
export async function getAttendanceWarningReport() {
  const students = await prisma.student.findMany({
    include: {
      course: true,
      attendances: true
    }
  });

  return students.map(s => {
    const totalDays = s.attendances.length;
    const absences = s.attendances.filter(a => a.status === "ABSENT").length;
    const rate = totalDays > 0 ? (absences / totalDays) * 100 : 0;
    return {
      id: s.id,
      name: `${s.lastName} ${s.firstName}`,
      course: s.course.name,
      absenceCount: absences,
      absenceRate: rate
    };
  }).filter(s => s.absenceRate >= 15).sort((a, b) => b.absenceRate - a.absenceRate);
}

/**
 * Obtiene el reporte consolidado de un curso.
 */
export async function getConsolidatedCourseReport(courseId?: string) {
  if (!courseId) return { courseName: "", subjects: [], data: [] };
  
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      students: {
        include: {
          grades: {
            include: { assignment: { include: { subject: true } } }
          }
        }
      },
      assignments: {
        include: { subject: true }
      }
    }
  });

  if (!course) return { courseName: "", subjects: [], data: [] };

  const subjects = course.assignments.map(a => ({ id: a.subject.id, name: a.subject.name }));

  const data = course.students.map(student => {
    const gradesMap: Record<string, string> = {};
    let total = 0;
    let count = 0;

    subjects.forEach(sub => {
      const g = student.grades.find(gr => gr.assignment.subjectId === sub.id);
      if (g) {
        const val = parseFloat(g.value);
        gradesMap[sub.id] = isNaN(val) ? g.value : val.toFixed(1);
        if (!isNaN(val)) {
          total += val;
          count++;
        }
      } else {
        gradesMap[sub.id] = "-";
      }
    });

    const average = count > 0 ? (total / count).toFixed(1) : "0.0";

    return {
      id: student.id,
      name: `${student.lastName} ${student.firstName}`,
      grades: gradesMap,
      average
    };
  }).sort((a, b) => parseFloat(b.average) - parseFloat(a.average));

  return {
    courseName: course.name,
    subjects,
    data
  };
}

/**
 * Obtiene el reporte de excelencia académica.
 */
export async function getExcellenceReport() {
  const students = await prisma.student.findMany({
    include: { course: true, grades: true }
  });
  
  return students.map(student => {
    const grades = student.grades.map(g => parseFloat(g.value) || 0);
    const average = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    return { 
      id: student.id,
      name: `${student.lastName} ${student.firstName}`,
      course: student.course.name,
      average: parseFloat(average.toFixed(1))
    };
  })
  .filter(s => s.average >= 4.0)
  .sort((a, b) => b.average - a.average)
  .slice(0, 10);
}
