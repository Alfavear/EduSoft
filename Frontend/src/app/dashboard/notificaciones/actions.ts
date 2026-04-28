"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const userId = (session.user as any).id;

  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
}

export async function markNotificationAsRead(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
  revalidatePath("/dashboard");
}

export async function createNotification(userId: string, title: string, message: string, type: "INFO" | "SUCCESS" | "WARNING" = "INFO", link?: string) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link
    }
  });
}
