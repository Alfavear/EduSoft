"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notificaciones/actions";

export async function getMessages(type: 'inbox' | 'sent') {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const userId = (session.user as any).id;

  return await prisma.message.findMany({
    where: type === 'inbox' ? { receiverId: userId } : { senderId: userId },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true,
          studentProfile: true,
          teacherProfile: true
        }
      },
      receiver: {
        select: {
          id: true,
          username: true,
          image: true,
          studentProfile: true,
          teacherProfile: true
        }
      },
      attachments: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function sendMessage(data: {
  receiverIds: string[],
  subject: string,
  content: string,
  attachments?: { name: string, type: string, data: string }[]
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "No autorizado" };

  const senderId = (session.user as any).id;
  const senderName = session.user.name;

  try {
    const messages = await prisma.$transaction(
      data.receiverIds.map(receiverId => 
        prisma.message.create({
          data: {
            senderId,
            receiverId,
            subject: data.subject,
            content: data.content,
            attachments: data.attachments ? {
              create: data.attachments.map(att => ({
                name: att.name,
                type: att.type,
                data: att.data
              }))
            } : undefined
          }
        })
      )
    );

    // Crear notificaciones para cada receptor
    await Promise.all(data.receiverIds.map(receiverId => 
      createNotification(
        receiverId,
        "Nuevo mensaje recibido",
        `${senderName} te ha enviado un mensaje: ${data.subject}`,
        "INFO",
        "/dashboard/mensajeria"
      )
    ));

    revalidatePath("/dashboard/mensajeria");
    return { success: true, count: messages.length };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Error al enviar el mensaje" };
  }
}

export async function markAsRead(messageId: string) {
  await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true }
  });
  revalidatePath("/dashboard/mensajeria");
}

export async function getRecipientsByContext() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  const results: { id: string, name: string, type: string, image: string | null }[] = [];

  // 1. Siempre incluir todos los administradores
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, username: true, image: true }
  });
  admins.forEach(a => results.push({ id: a.id, name: `Admin: ${a.username}`, type: 'ADMIN', image: a.image }));

  // 2. Si es ADMIN, puede ver a todos los docentes
  if (role === 'ADMIN') {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      include: { teacherProfile: true }
    });
    teachers.forEach(t => results.push({ 
      id: t.id, 
      name: `Docente: ${t.teacherProfile?.firstName} ${t.teacherProfile?.lastName}`, 
      type: 'TEACHER',
      image: t.image
    }));

    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { studentProfile: { include: { course: true } } }
    });
    students.forEach(s => results.push({ 
      id: s.id, 
      name: `Estudiante: ${s.studentProfile?.firstName} ${s.studentProfile?.lastName} (${s.studentProfile?.course.name})`, 
      type: 'STUDENT',
      image: s.image
    }));
  }

  // 3. Si es TEACHER, puede ver a sus estudiantes
  if (role === 'TEACHER') {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        assignments: {
          include: {
            course: {
              include: {
                students: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (teacher) {
      teacher.assignments.forEach(as => {
        as.course.students.forEach(s => {
          results.push({ 
            id: s.user.id, 
            name: `Estudiante: ${s.firstName} ${s.lastName} (${as.course.name})`, 
            type: 'STUDENT',
            image: s.user.image
          });
        });
      });
    }
  }

  // 4. Si es STUDENT, puede ver a sus profesores
  if (role === 'STUDENT') {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        course: {
          include: {
            assignments: {
              include: {
                teacher: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (student) {
      student.course.assignments.forEach(as => {
        results.push({ 
          id: as.teacher.user.id, 
          name: `Docente: ${as.teacher.firstName} ${as.teacher.lastName} (${as.subjectId})`, 
          type: 'TEACHER',
          image: as.teacher.user.image
        });
      });
    }
  }

  // Eliminar duplicados por ID
  const uniqueResults = results.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  return uniqueResults;
}
