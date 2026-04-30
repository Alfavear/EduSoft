"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSchoolInfo() {
  let info = await prisma.schoolInfo.findUnique({
    where: { id: "institutional-info" }
  });

  if (!info) {
    info = await prisma.schoolInfo.create({
      data: { id: "institutional-info", name: "Nombre del Colegio" }
    });
  }

  return info;
}


export async function updateSchoolInfo(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "No autorizado" };

    const formattedData = {
      ...data,
      attendanceLimitDays: data.attendanceLimitDays ? parseInt(data.attendanceLimitDays) : 1,
      alertThreshold: data.alertThreshold ? parseFloat(data.alertThreshold) : 3.0,
      sessionTimeout: data.sessionTimeout ? parseInt(data.sessionTimeout) : 60,
      keepSessionOpen: !!data.keepSessionOpen
    };

    await prisma.schoolInfo.upsert({
      where: { id: "institutional-info" },
      update: formattedData,
      create: { ...formattedData, id: "institutional-info" }
    });

    // Audit log
    await createAuditLog({
      userId: (session.user as any).id,
      action: "UPDATE_SCHOOL_INFO",
      entity: "SchoolInfo",
      entityId: "institutional-info",
      details: `Actualización de parámetros institucionales y de seguridad. Timeout: ${formattedData.sessionTimeout}, KeepOpen: ${formattedData.keepSessionOpen}`
    });

    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    console.error("Error updating school info:", error);
    return { success: false, error: "No se pudo actualizar la información." };
  }
}


export async function getAuditLogs(search?: string) {
  const where: any = {};
  if (search) {
    where.OR = [
      { action: { contains: search, mode: 'insensitive' } },
      { entity: { contains: search, mode: 'insensitive' } },
      { user: { username: { contains: search, mode: 'insensitive' } } }
    ];
  }

  return await prisma.auditLog.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}
