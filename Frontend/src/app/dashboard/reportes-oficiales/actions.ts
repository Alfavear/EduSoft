"use server";

import { prisma } from "@/lib/prisma";

/**
 * Obtiene los estudiantes cuya información está incompleta para el reporte SIMAT.
 */
export async function getMissingSIMATData() {
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { documentType: null },
        { gender: null },
        { stratus: null },
        { sisben: null },
        { birthDate: null },
        { address: null }
      ]
    },
    include: {
      course: true
    }
  });

  return students.map(s => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    course: s.course.name,
    missing: [
      !s.documentType && "Tipo Documento",
      !s.gender && "Género",
      !s.stratus && "Estrato",
      !s.sisben && "SISBÉN",
      !s.birthDate && "Fecha Nacimiento",
      !s.address && "Dirección"
    ].filter(Boolean)
  }));
}

/**
 * Genera la estructura de datos para el Anexo 6A (SIMAT).
 * Devuelve un arreglo de objetos listos para ser convertidos a CSV.
 */
export async function exportSIMATAnexo6A(academicYearId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { academicYearId, status: 'ENROLLED' },
    include: {
      student: {
        include: { course: true }
      }
    }
  });

  const school = await prisma.schoolInfo.findFirst();

  return enrollments.map(en => {
    const s = en.student;
    return {
      "TIPO_DOCUMENTO": s.documentType || "",
      "NUMERO_DOCUMENTO": s.documentId || "",
      "EXP_DEPTO": "",
      "EXP_MUN": "",
      "APELLIDO1": s.lastName.split(' ')[0] || "",
      "APELLIDO2": s.lastName.split(' ')[1] || "",
      "NOMBRE1": s.firstName.split(' ')[0] || "",
      "NOMBRE2": s.firstName.split(' ')[1] || "",
      "GENERO": s.gender === "M" ? "M" : "F",
      "FECHA_NACIMIENTO": s.birthDate?.toISOString().split('T')[0] || "",
      "ESTRATO": s.stratus || "",
      "SISBEN": s.sisben || "",
      "DISCAPACIDAD": s.disabilityType || "99", // 99 es usualmente "Ninguna"
      "VICTIMA_CONFLICTO": s.isVictim ? "1" : "9",
      "ETNIA": s.ethnicGroup || "0",
      "PAE": s.paeBeneficiary ? "S" : "N",
      "TRANSPORTE": s.transportBeneficiary ? "S" : "N",
      "GRADO": s.course.name,
      "CODIGO_DANE_SEDE": school?.daneCode || ""
    };
  });
}

/**
 * Obtiene estadísticas consolidadas para el Formulario C-600 (DANE).
 */
export async function getDANEC600Stats() {
  const [studentsByGender, teachersByDegree, enrollmentsByGrade] = await Promise.all([
    prisma.student.groupBy({ by: ['gender'], _count: true }),
    prisma.teacher.groupBy({ by: ['highestDegree'], _count: true }),
    prisma.enrollment.findMany({
      where: { status: 'ENROLLED' },
      include: { course: true }
    })
  ]);

  return {
    studentsByGender,
    teachersByDegree,
    enrollmentsCount: enrollmentsByGrade.length
  };
}
