"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAcademicYear(data: { name: string, periods: { name: string, weight: number }[] }) {
  try {
    // Desactivar otros años si este es nuevo (opcional, por ahora solo creamos)
    const year = await prisma.academicYear.create({
      data: {
        name: data.name,
        isActive: true, // Por defecto activamos el último creado
        periods: {
          create: data.periods.map(p => ({
            name: p.name,
            weight: p.weight,
            status: "OPEN"
          }))
        }
      }
    });

    // Desactivar años anteriores
    await prisma.academicYear.updateMany({
      where: { id: { not: year.id } },
      data: { isActive: false }
    });

    revalidatePath("/dashboard/configuracion");
    return { success: true, data: year };
  } catch (error) {
    console.error("Error creating academic year:", error);
    return { success: false, error: "Error al crear el año lectivo." };
  }
}

export async function getAcademicYears() {
  return await prisma.academicYear.findMany({
    include: { periods: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function togglePeriodStatus(periodId: string, currentStatus: "OPEN" | "CLOSED") {
  try {
    const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    await prisma.academicPeriod.update({
      where: { id: periodId },
      data: { status: newStatus }
    });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al cambiar el estado del periodo." };
  }
}

export async function toggleYearStatus(yearId: string, currentStatus: boolean) {
    try {
      if (!currentStatus) {
          // Activar este año y desactivar los demás
          await prisma.academicYear.updateMany({ data: { isActive: false } });
          await prisma.academicYear.update({ where: { id: yearId }, data: { isActive: true } });
      } else {
          await prisma.academicYear.update({ where: { id: yearId }, data: { isActive: false } });
      }
      revalidatePath("/dashboard/configuracion");
      return { success: true };
    } catch (error) {
      return { success: false };
    }
}
