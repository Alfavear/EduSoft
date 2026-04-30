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
