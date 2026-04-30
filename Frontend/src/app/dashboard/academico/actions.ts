"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function createCourse(data: { name: string, description?: string, directorId?: string }) {
  try {
    const course = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        directorId: data.directorId || undefined
      }
    });
    revalidatePath("/dashboard/academico");
    revalidatePath("/dashboard/usuarios");

    // Auditoría
    const session = await getServerSession(authOptions);
    if (session?.user) {
      await createAuditLog({
        userId: (session.user as any).id,
        action: "CREATE_COURSE",
        entity: "COURSE",
        entityId: course.id,
        details: `Se creó el curso: ${course.name}`
      });
    }

    return { success: true, data: course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Error al crear el salón/curso." };
  }
}

export async function createSubject(data: { name: string, gradingConfigId: string }) {
  try {
    const subject = await prisma.subject.create({
      data
    });
    revalidatePath("/dashboard/academico");

    // Auditoría
    const session = await getServerSession(authOptions);
    if (session?.user) {
      await createAuditLog({
        userId: (session.user as any).id,
        action: "CREATE_SUBJECT",
        entity: "SUBJECT",
        entityId: subject.id,
        details: `Se creó la materia: ${subject.name}`
      });
    }

    return { success: true, data: subject };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { success: false, error: "Error al crear la materia." };
  }
}

export async function getAcademicData() {
  const [courses, subjects, gradingConfigs, teachers] = await Promise.all([
    prisma.course.findMany({ 
      include: { 
        _count: { select: { students: true } },
        director: true
      },
      orderBy: { name: 'asc' }
    }),
    prisma.subject.findMany({ 
      include: { gradingConfig: true },
      orderBy: { name: 'asc' }
    }),
    prisma.gradingConfig.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.teacher.findMany({
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })
  ]);
  return { courses, subjects, gradingConfigs, teachers };
}

export async function createGradingConfig(data: { name: string, type: string, minValue?: number, maxValue?: number, allowedValues?: string }) {
  try {
    const config = await prisma.gradingConfig.create({
      data: {
        name: data.name,
        type: data.type,
        minValue: data.minValue,
        maxValue: data.maxValue,
        allowedValues: data.allowedValues
      }
    });
    revalidatePath("/dashboard/academico");
    return { success: true, data: config };
  } catch (error) {
    console.error("Error creating grading config:", error);
    return { success: false, error: "Error al crear esquema de calificación." };
  }
}
