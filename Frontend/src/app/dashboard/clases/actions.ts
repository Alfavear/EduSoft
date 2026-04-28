"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTeacherAssignments() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const role = (session.user as any).role;
  const username = (session.user as any).username;

  if (role === "ADMIN") {
    return await prisma.teacherAssignment.findMany({
      include: {
        teacher: true,
        course: true,
        subject: true
      }
    });
  }

  if (role !== "TEACHER") return [];

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      teacherProfile: {
        include: {
          assignments: {
            include: {
              course: true,
              subject: true
            }
          }
        }
      }
    }
  });

  return user?.teacherProfile?.assignments || [];
}

export async function getAssignmentDetails(assignmentId: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  const assignment = await prisma.teacherAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: { 
        include: { 
          students: true 
        } 
      },
      subject: { 
        include: { 
          gradingConfig: true 
        } 
      },
      grades: {
        include: { period: true }
      },
      accessRequests: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });


  return assignment;
}

export async function getActivePeriods() {
  const year = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: { periods: true }
  });
  return year?.periods || [];
}

export async function saveGrades(grades: { studentId: string, assignmentId: string, periodId: string, value: string }[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "No autorizado" };

  const role = (session.user as any).role;

  // Si no es admin, validar bloqueo de periodo
  if (role !== "ADMIN") {
    for (const g of grades) {
      const period = await prisma.academicPeriod.findUnique({ where: { id: g.periodId } });
      
      if (period?.status === "CLOSED") {
        // Verificar si tiene autorización aprobada y no expirada
        const request = await prisma.accessRequest.findFirst({
          where: {
            assignmentId: g.assignmentId,
            periodId: g.periodId,
            status: "APPROVED",
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        });

        if (!request) {
          return { success: false, error: `El periodo ${period.name} está cerrado. Solicita autorización al administrador.` };
        }
      }
    }
  }

  try {
    await prisma.$transaction(
      grades.map(grade => prisma.grade.upsert({
        where: {
          studentId_assignmentId_periodId: {
            studentId: grade.studentId,
            assignmentId: grade.assignmentId,
            periodId: grade.periodId
          }
        },
        update: { value: grade.value },
        create: grade
      }))
    );
    return { success: true };
  } catch (error) {
    console.error("Error saving grades:", error);
    return { success: false, error: "Error al guardar las calificaciones." };
  }
}

// SOLICITUDES DE ACCESO
export async function createAccessRequest(data: { assignmentId: string, periodId: string, reason: string }) {
  try {
    await prisma.accessRequest.create({
      data: {
        ...data,
        status: "PENDING"
      }
    });
    revalidatePath(`/dashboard/clases/${data.assignmentId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo enviar la solicitud." };
  }
}

export async function getAllAccessRequests() {
  return await prisma.accessRequest.findMany({
    include: {
      assignment: {
        include: {
          teacher: true,
          course: true,
          subject: true
        }
      },
      period: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function respondToRequest(requestId: string, status: "APPROVED" | "REJECTED", hours?: number) {
  try {
    const expiresAt = hours ? new Date(Date.now() + hours * 60 * 60 * 1000) : null;
    await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status, expiresAt }
    });
    revalidatePath("/dashboard/admin/solicitudes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al responder a la solicitud." };
  }
}
