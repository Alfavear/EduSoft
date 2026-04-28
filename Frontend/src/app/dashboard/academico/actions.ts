"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCourse(data: { name: string, description?: string }) {
  try {
    const course = await prisma.course.create({
      data
    });
    revalidatePath("/dashboard/academico");
    revalidatePath("/dashboard/usuarios");
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
    return { success: true, data: subject };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { success: false, error: "Error al crear la materia." };
  }
}

export async function getAcademicData() {
  const [courses, subjects, gradingConfigs] = await Promise.all([
    prisma.course.findMany({ include: { _count: { select: { students: true } } } }),
    prisma.subject.findMany({ include: { gradingConfig: true } }),
    prisma.gradingConfig.findMany()
  ]);
  return { courses, subjects, gradingConfigs };
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
