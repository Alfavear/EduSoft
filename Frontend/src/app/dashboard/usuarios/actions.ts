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
  courseId?: string,
  documentId?: string,
  guardianName?: string,
  guardianPhone?: string,
  guardianEmail?: string,
  address?: string,
  bloodType?: string,
  birthDate?: string,
  phone?: string,
  specialization?: string
}) {
  try {
    let finalUsername = data.username;
    let finalPassword = data.password;

    if (data.role !== "ADMIN") {
      const baseUsername = `${data.firstName.trim().toLowerCase()}.${data.lastName.trim().toLowerCase()}`.replace(/\s+/g, '');
      finalUsername = baseUsername;
      
      let counter = 1;
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${baseUsername}${counter}`;
        counter++;
      }
      
      finalPassword = data.documentId || "123456";
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const user = await prisma.user.create({
      data: {
        username: finalUsername,
        password: hashedPassword,
        role: data.role,
        ...(data.role === "STUDENT" && data.courseId ? {
          studentProfile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              courseId: data.courseId,
              documentId: data.documentId || undefined,
              guardianName: data.guardianName || "No registrado",
              guardianPhone: data.guardianPhone || "0000000000",
              guardianEmail: data.guardianEmail || undefined,
              address: data.address || undefined,
              bloodType: data.bloodType || undefined,
              birthDate: data.birthDate ? new Date(data.birthDate) : undefined
            }
          }
        } : {}),
        ...(data.role === "TEACHER" ? {
          teacherProfile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              documentId: data.documentId || undefined,
              phone: data.phone || undefined,
              address: data.address || undefined,
              specialization: data.specialization || undefined
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

export async function resetPassword(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, teacherProfile: true }
    });

    if (!user) return { success: false, error: "Usuario no encontrado" };

    const documentId = user.studentProfile?.documentId || user.teacherProfile?.documentId;
    
    if (!documentId) {
      return { success: false, error: "El usuario no tiene un documento registrado para usar como contraseña." };
    }

    const hashedPassword = await bcrypt.hash(documentId, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Error al restablecer contraseña" };
  }
}
