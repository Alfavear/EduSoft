"use server";

import { prisma } from "@/lib/prisma";

export async function getTopBarData() {
  try {
    const [school, year] = await Promise.all([
      prisma.schoolInfo.findUnique({ where: { id: "institutional-info" } }),
      prisma.academicYear.findFirst({
        where: { isActive: true },
        include: { periods: { where: { status: 'OPEN' }, take: 1 } }
      })
    ]);

    return {
      schoolName: school?.name || "EduSoft",
      periodName: year?.periods[0]?.name || "Sin periodo activo"
    };
  } catch (error) {
    console.error("Error fetching topbar data:", error);
    return {
      schoolName: "EduSoft",
      periodName: "---"
    };
  }
}
