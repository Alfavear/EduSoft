"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createResetRequest(formData: FormData) {
  const documentType = formData.get("documentType") as string;
  const documentId = formData.get("documentId") as string;

  if (!documentType || !documentId) {
    throw new Error("Datos incompletos");
  }

  await prisma.passwordResetRequest.create({
    data: {
      documentType,
      documentId
    }
  });

  return { success: true };
}

export async function getResetRequests() {
  return await prisma.passwordResetRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: 'desc' }
  });
}

export async function approveResetRequest(requestId: string) {
  const request = await prisma.passwordResetRequest.findUnique({
    where: { id: requestId }
  });

  if (!request) return;

  // Find user by documentId in Student or Teacher
  const student = await prisma.student.findFirst({
    where: { documentId: request.documentId },
    include: { user: true }
  });

  const teacher = !student ? await prisma.teacher.findFirst({
    where: { documentId: request.documentId },
    include: { user: true }
  }) : null;

  const target = student || teacher;

  if (target && target.user) {
    const firstName = target.firstName.toLowerCase().replace(/\s/g, '');
    const lastName = target.lastName.toLowerCase().split(' ')[0];
    const newUsername = `${firstName}.${lastName}`;
    
    // Reset password to documentId and username to nombre.apellido
    await prisma.user.update({
      where: { id: target.userId },
      data: {
        username: newUsername,
        password: request.documentId // En un entorno real, usaría hashing (bcrypt)
      }
    });
  }

  await prisma.passwordResetRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" }
  });

  revalidatePath("/dashboard/solicitudes");
}
