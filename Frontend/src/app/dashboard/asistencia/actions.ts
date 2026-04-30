"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSchoolInfo } from "../configuracion/schoolActions";

export async function getAttendanceData(courseId: string, dateStr: string) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  const students = await prisma.student.findMany({
    where: { courseId },
    include: {
      attendances: {
        where: { date }
      }
    },
    orderBy: [
      { lastName: 'asc' },
      { firstName: 'asc' }
    ]
  });

  return students.map(s => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    status: s.attendances[0]?.status || null
  }));
}

export async function saveAttendance(courseId: string, dateStr: string, records: { studentId: string, status: any }[], teacherId?: string) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  try {
    const operations = records.map(r => 
      prisma.attendance.upsert({
        where: {
          studentId_courseId_date: {
            studentId: r.studentId,
            courseId,
            date
          }
        },
        update: { status: r.status, teacherId },
        create: {
          studentId: r.studentId,
          courseId,
          date,
          status: r.status,
          teacherId
        }
      })
    );

    await prisma.$transaction(operations);
    revalidatePath("/dashboard/asistencia");
    return { success: true };
  } catch (error) {
    console.error("Error saving attendance:", error);
    return { success: false, error: "No se pudo guardar la asistencia." };
  }
}

export async function checkAttendancePermission(dateStr: string) {
  const info = await getSchoolInfo();
  const limit = info.attendanceLimitDays || 1;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today.getTime() - targetDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Si la fecha es futura, no permitir
  if (targetDate > today) return { allowed: false, future: true };
  
  // Si está dentro del límite
  if (diffDays <= limit) return { allowed: true };
  
  // Si se pasó el límite, verificar si tiene una solicitud aprobada
  const approvedRequest = await prisma.attendanceRequest.findFirst({
    where: {
      date: targetDate,
      status: 'APPROVED'
    }
  });

  return { allowed: !!approvedRequest, needsRequest: !approvedRequest };
}

export async function createAttendanceRequest(teacherId: string, courseId: string, dateStr: string, reason: string) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  try {
    await prisma.attendanceRequest.create({
      data: {
        teacherId,
        courseId,
        date,
        reason,
        status: 'PENDING'
      }
    });
    revalidatePath("/dashboard/asistencia");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo crear la solicitud." };
  }
}

export async function getAttendanceRequests() {
  return await prisma.attendanceRequest.findMany({
    where: { status: 'PENDING' },
    include: {
      teacher: true,
      course: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function approveAttendanceRequest(id: string, status: 'APPROVED' | 'REJECTED') {
  try {
    await prisma.attendanceRequest.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/dashboard/asistencia");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
