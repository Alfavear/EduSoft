"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(data: { 
  username: string, 
  password: string, 
  role: "ADMIN" | "TEACHER" | "STUDENT",
  firstName: string,
  lastName: string,
  courseId?: string
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
        ...(data.role === "STUDENT" && data.courseId ? {
          studentProfile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              courseId: data.courseId
            }
          }
        } : {}),
        ...(data.role === "TEACHER" ? {
          teacherProfile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName
            }
          }
        } : {})
      }
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "El nombre de usuario ya existe." };
    }
    return { success: false, error: "Error al crear el usuario." };
  }
}

export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      studentProfile: { include: { course: true } },
      teacherProfile: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCourses() {
  return await prisma.course.findMany();
}

export async function getStudentReport(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      course: {
        include: {
          assignments: {
            include: {
              subject: { include: { gradingConfig: true } },
              grades: {
                where: { studentId: studentId },
                include: { period: true }
              }
            }
          }
        }
      }
    }
  });

  if (!student) return null;

  const activeYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: { periods: { orderBy: { createdAt: 'asc' } } }
  });

  return {
    student,
    assignments: student.course.assignments,
    periods: activeYear?.periods || []
  };
}
