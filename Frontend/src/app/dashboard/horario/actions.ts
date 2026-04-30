"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWeeklySchedule(params: { courseId?: string, teacherId?: string }) {
  const { courseId, teacherId } = params;

  if (courseId) {
    return await prisma.scheduleItem.findMany({
      where: { assignment: { courseId } },
      include: { 
        assignment: { 
          include: { subject: true, teacher: true } 
        } 
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });
  }

  if (teacherId) {
    return await prisma.scheduleItem.findMany({
      where: { assignment: { teacherId } },
      include: { 
        assignment: { 
          include: { subject: true, course: true, teacher: true } 
        } 
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });
  }

  return [];
}

export async function addScheduleItem(data: { dayOfWeek: number, startTime: string, endTime: string, assignmentId: string }) {
  // Get current assignment details
  const assignment = await prisma.teacherAssignment.findUnique({
    where: { id: data.assignmentId },
    include: { teacher: true, course: true }
  });

  if (!assignment) throw new Error("Asignación no encontrada");

  // 1. Check if teacher is busy
  const teacherConflict = await prisma.scheduleItem.findFirst({
    where: {
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      assignment: { teacherId: assignment.teacherId }
    },
    include: { assignment: { include: { course: true, subject: true } } }
  });

  if (teacherConflict) {
    throw new Error(`Conflicto de Docente: ${assignment.teacher.firstName} ya tiene una clase de ${teacherConflict.assignment.subject.name} en ${teacherConflict.assignment.course.name} a esta hora.`);
  }

  // 2. Check if course is busy
  const courseConflict = await prisma.scheduleItem.findFirst({
    where: {
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      assignment: { courseId: assignment.courseId }
    },
    include: { assignment: { include: { subject: true } } }
  });

  if (courseConflict) {
    throw new Error(`Conflicto de Curso: El curso ${assignment.course.name} ya tiene clase de ${courseConflict.assignment.subject.name} a esta hora.`);
  }

  await prisma.scheduleItem.create({
    data: {
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      assignmentId: data.assignmentId
    }
  });
  revalidatePath("/dashboard/horario");
}

export async function deleteScheduleItem(id: string) {
  await prisma.scheduleItem.delete({ where: { id } });
  revalidatePath("/dashboard/horario");
}
