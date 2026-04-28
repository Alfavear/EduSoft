"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    await prisma.schoolInfo.upsert({
      where: { id: "institutional-info" },
      update: data,
      create: { ...data, id: "institutional-info" }
    });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (error) {
    console.error("Error updating school info:", error);
    return { success: false, error: "No se pudo actualizar la información." };
  }
}
