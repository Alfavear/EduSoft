"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role, EventType } from "@prisma/client";

export async function getEvents(params?: { role?: Role, courseId?: string }) {
  const { role, courseId } = params || {};
  
  return await prisma.calendarEvent.findMany({
    where: {
      OR: [
        { isGlobal: true },
        { courseId: courseId || undefined },
        { targetRole: role || undefined }
      ]
    },
    orderBy: { startDate: 'asc' }
  });
}

export async function createEvent(formData: FormData, creatorId?: string) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const type = formData.get("type") as EventType;
  const isGlobal = formData.get("isGlobal") === "on";
  const targetRole = formData.get("targetRole") as Role | null;
  const courseId = formData.get("courseId") as string | null;

  await prisma.calendarEvent.create({
    data: {
      title,
      description,
      startDate,
      type,
      isGlobal,
      targetRole: targetRole || null,
      courseId: courseId || null,
      creatorId
    }
  });

  revalidatePath("/dashboard/calendario");
}

export async function deleteEvent(id: string) {
  await prisma.calendarEvent.delete({ where: { id } });
  revalidatePath("/dashboard/calendario");
}
