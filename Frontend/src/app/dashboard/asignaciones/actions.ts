"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAssignment(data: { teacherId: string, courseId: string, subjectId: string }) {
  try {
    const assignment = await prisma.teacherAssignment.create({
      data
    });
    revalidatePath("/dashboard/asignaciones");
    return { success: true, data: assignment };
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Esta asignación ya existe para este docente, curso y materia." };
    }
    return { success: false, error: "Error al crear la asignación." };
  }
}

export async function getAssignmentData() {
  const [teachers, courses, subjects, assignments] = await Promise.all([
    prisma.teacher.findMany({ orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }] }),
    prisma.course.findMany({ orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.teacherAssignment.findMany({
      include: {
        teacher: true,
        course: true,
        subject: true
      },
      orderBy: {
        course: { name: 'asc' }
      }
    })
  ]);
  return { teachers, courses, subjects, assignments };
}

export async function deleteAssignment(id: string) {
  try {
    await prisma.teacherAssignment.delete({ where: { id } });
    revalidatePath("/dashboard/asignaciones");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar la asignación." };
  }
}
