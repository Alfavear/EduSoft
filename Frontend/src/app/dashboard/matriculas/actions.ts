"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Gestión de Matrículas (Enrollments) ---

export async function getEnrollments(filters?: { academicYearId?: string; courseId?: string; status?: any }) {
  return await prisma.enrollment.findMany({
    where: {
      academicYearId: filters?.academicYearId,
      courseId: filters?.courseId,
      status: filters?.status
    },
    include: {
      student: true,
      course: true,
      academicYear: true,
      remedials: {
        include: { subject: true }
      },
      officialDocuments: true
    },
    orderBy: { student: { lastName: 'asc' } }
  });
}

export async function enrollStudent(data: { studentId: string; academicYearId: string; courseId: string }) {
  const enrollment = await prisma.enrollment.upsert({
    where: {
      studentId_academicYearId: {
        studentId: data.studentId,
        academicYearId: data.academicYearId
      }
    },
    update: {
      courseId: data.courseId,
      status: 'ENROLLED'
    },
    create: {
      studentId: data.studentId,
      academicYearId: data.academicYearId,
      courseId: data.courseId,
      status: 'ENROLLED'
    }
  });

  // También actualizamos el curso actual en el perfil del estudiante
  await prisma.student.update({
    where: { id: data.studentId },
    data: { courseId: data.courseId }
  });

  revalidatePath("/dashboard/matriculas");
  return enrollment;
}

// --- Datos Oficiales SIMAT (Colombia) ---

export async function updateStudentOfficialData(studentId: string, data: any) {
  const student = await prisma.student.update({
    where: { id: studentId },
    data: {
      documentType: data.documentType,
      gender: data.gender,
      stratus: data.stratus ? parseInt(data.stratus) : undefined,
      sisben: data.sisben,
      eps: data.eps,
      ethnicity: data.ethnicity,
      disability: data.disability,
      isVictim: data.isVictim === 'true' || data.isVictim === true
    }
  });
  revalidatePath("/dashboard/matriculas");
  return student;
}

import { getPerformanceLevel, isPassed, calculateAverage } from "@/lib/gradingUtils";

export async function closeAcademicYear(academicYearId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { academicYearId, status: 'ENROLLED' },
    include: {
      student: {
        include: {
          grades: {
            where: {
              period: { academicYearId }
            }
          }
        }
      }
    }
  });

  const results = await Promise.all(
    enrollments.map(async (en) => {
      // Cálculo de promedio general del año
      const grades = en.student.grades.map(g => g.value);
      if (grades.length === 0) return { id: en.id, status: 'SKIPPED' };

      const avg = calculateAverage(grades);
      const nationalScale = getPerformanceLevel(avg);
      const status = isPassed(avg) ? "PASSED" : "REMEDIAL";

      return prisma.enrollment.update({
        where: { id: en.id },
        data: {
          status,
          finalAverage: avg,
          nationalScale,
          promotionDate: new Date()
        }
      });
    })
  );

  revalidatePath("/dashboard/matriculas");
  return results.length;
}


// --- Gestión de Nivelatorios (Remedials) ---

export async function registerRemedial(data: {
  enrollmentId: string;
  subjectId: string;
  teacherId: string;
  date: Date;
  description: string;
}) {
  const remedial = await prisma.remedialSession.create({
    data: {
      enrollmentId: data.enrollmentId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      date: data.date,
      description: data.description,
      status: 'PENDING'
    }
  });
  revalidatePath("/dashboard/matriculas");
  return remedial;
}

export async function updateRemedialResult(id: string, status: string, grade?: string) {
  const remedial = await prisma.remedialSession.update({
    where: { id },
    data: { status, grade }
  });

  // Si aprueba el nivelatorio, podemos re-evaluar el estado de la matrícula
  if (status === 'PASSED') {
    const en = await prisma.enrollment.findUnique({
      where: { id: remedial.enrollmentId },
      include: { remedials: true }
    });

    const allPassed = en?.remedials.every(r => r.status === 'PASSED');
    if (allPassed) {
      await prisma.enrollment.update({
        where: { id: en!.id },
        data: { status: 'PASSED' }
      });
    }
  }

  revalidatePath("/dashboard/matriculas");
  return remedial;
}

export async function promoteStudents(sourceYearId: string, targetYearId: string) {
  const approvedEnrollments = await prisma.enrollment.findMany({
    where: {
      academicYearId: sourceYearId,
      status: 'PASSED',
      prematriculaUrl: { not: null } // Solo los que diligenciaron la prematrícula
    },
    include: {
      student: true,
      course: true
    }
  });

  const results = await Promise.all(
    approvedEnrollments.map(async (en) => {
      // Si el curso tiene un siguiente nivel definido
      if (en.course.nextCourseId) {
        // Creamos la matrícula para el año destino
        const newEnrollment = await prisma.enrollment.upsert({
          where: {
            studentId_academicYearId: {
              studentId: en.studentId,
              academicYearId: targetYearId
            }
          },
          update: {
            courseId: en.course.nextCourseId,
            status: 'ENROLLED'
          },
          create: {
            studentId: en.studentId,
            academicYearId: targetYearId,
            courseId: en.course.nextCourseId,
            status: 'ENROLLED'
          }
        });

        // Actualizamos el curso actual del estudiante
        await prisma.student.update({
          where: { id: en.studentId },
          data: { courseId: en.course.nextCourseId }
        });

        return newEnrollment;
      }
      return null;
    })
  );

  revalidatePath("/dashboard/matriculas");
  return results.filter(r => r !== null).length;
}

export async function uploadPrematricula(enrollmentId: string, url: string) {
  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { prematriculaUrl: url }
  });
  revalidatePath("/dashboard/matriculas");
  return enrollment;
}

export async function registerStudent(formData: FormData) {
  try {
    const data: any = {};
    formData.forEach((value, key) => {
      if (typeof value === 'string') data[key] = value;
    });

    const username = `${data.firstName.trim().toLowerCase()}.${data.lastName.trim().toLowerCase()}`.replace(/\s+/g, '');
    const user = await prisma.user.create({
      data: {
        username,
        password: data.documentId,
        role: "STUDENT"
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        documentId: data.documentId,
        documentType: data.documentType,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        bloodType: data.bloodType,
        stratus: data.stratus ? parseInt(data.stratus) : undefined,
        sisben: data.sisben,
        eps: data.eps,
        address: data.address,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail,
        courseId: data.courseId,
        paeBeneficiary: data.paeBeneficiary === "true",
        transportBeneficiary: data.transportBeneficiary === "true",
        disabilityType: data.disabilityType,
        isVictim: data.isVictim === "true"
      }
    });

    // Procesar archivos si existen
    const idFile = formData.get("idDocument") as File;
    const medFile = formData.get("medicalCert") as File;

    if (idFile && idFile.size > 0) {
      const fd = new FormData();
      fd.append("file", idFile);
      fd.append("studentId", student.id);
      fd.append("name", "Documento de Identidad");
      await uploadOfficialDocument(fd);
    }

    if (medFile && medFile.size > 0) {
      const fd = new FormData();
      fd.append("file", medFile);
      fd.append("studentId", student.id);
      fd.append("name", "Certificado Médico / EPS");
      await uploadOfficialDocument(fd);
    }

    revalidatePath("/dashboard/matriculas");
    return { success: true, data: student };
  } catch (error) {
    console.error("Error registering student:", error);
    return { success: false, error: "Error al registrar el estudiante." };
  }
}

export async function changeStudentDocument(studentId: string, data: { newDocumentId: string, newDocumentType: string, reason: string }) {
  try {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error("Estudiante no encontrado");

    await prisma.documentChange.create({
      data: {
        studentId,
        oldDocumentId: student.documentId || "No registrado",
        oldDocumentType: student.documentType || "N/A",
        newDocumentId: data.newDocumentId,
        newDocumentType: data.newDocumentType,
        reason: data.reason
      }
    });

    await prisma.student.update({
      where: { id: studentId },
      data: {
        documentId: data.newDocumentId,
        documentType: data.newDocumentType
      }
    });

    revalidatePath("/dashboard/matriculas");
    return { success: true };
  } catch (error) {
    console.error("Error changing document:", error);
    return { success: false, error: "Error al procesar el cambio de documento." };
  }
}

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadOfficialDocument(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const studentId = formData.get("studentId") as string;
    const enrollmentId = formData.get("enrollmentId") as string;
    const documentName = formData.get("name") as string;

    if (!file) throw new Error("No se recibió ningún archivo");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const path = join(process.cwd(), "public", "uploads", fileName);
    
    await writeFile(path, buffer);
    const fileUrl = `/uploads/${fileName}`;

    const doc = await prisma.officialDocument.create({
      data: {
        studentId: studentId || null,
        enrollmentId: enrollmentId || null,
        name: documentName,
        fileUrl,
        fileType: file.type
      }
    });

    revalidatePath("/dashboard/matriculas");
    return { success: true, data: doc };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Error al subir el archivo físico." };
  }
}

export async function getStudentDocuments(studentId: string) {
  return await prisma.officialDocument.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' }
  });
}



