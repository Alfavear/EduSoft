"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentsForReports() {
  return await prisma.student.findMany({
    include: {
      course: true,
      user: {
        select: {
          username: true
        }
      }
    },
    orderBy: [
      { course: { name: 'asc' } },
      { lastName: 'asc' }
    ]
  });
}

export async function getActivePeriodsForReports() {
  const activeYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: {
      periods: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
  return activeYear ? activeYear.periods : [];
}

export async function getAssignmentsForReports() {
  return await prisma.teacherAssignment.findMany({
    include: {
      subject: true,
      course: true,
      teacher: true
    },
    orderBy: [
      { course: { name: 'asc' } },
      { subject: { name: 'asc' } }
    ]
  });
}
