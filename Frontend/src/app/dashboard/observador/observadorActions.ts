"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ObservationType, Severity, MeetingStatus } from "@prisma/client";
import { uploadOfficialDocument } from "../matriculas/actions";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentTeacher() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return await prisma.teacher.findUnique({
    where: { userId: session.user.id }
  });
}

export async function getStudentsForObserver() {
  return await prisma.student.findMany({
    include: {
      course: true,
      observations: {
        select: { severity: true }
      },
      parentMeetings: {
        select: { id: true }
      },
      _count: {
        select: {
          observations: true,
          parentMeetings: true
        }
      }
    },
    orderBy: { lastName: 'asc' }
  });
}

export async function getObserverConfig() {
  return await prisma.schoolInfo.findFirst({
    select: { conditionalThreshold: true }
  });
}

export async function getCourses() {
  return await prisma.course.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getStudentObserverData(studentId: string) {
  return await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      course: true,
      observations: {
        include: {
          teacher: true,
          followUps: { orderBy: { date: 'asc' } },
          agreements: true,
          meetings: { orderBy: { date: 'desc' } }
        },
        orderBy: { date: 'desc' }
      },
      parentMeetings: {
        include: {
          agreements: true,
          observation: true
        },
        orderBy: { date: 'desc' }
      }
    }
  });
}

export async function createObservation(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const teacherId = formData.get("teacherId") as string;
    const type = formData.get("type") as ObservationType;
    const severity = formData.get("severity") as Severity;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    const observation = await prisma.observation.create({
      data: {
        studentId,
        teacherId,
        type,
        severity,
        description,
      }
    });

    if (file && file.size > 0) {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      uploadFd.append("studentId", studentId);
      uploadFd.append("name", `Soporte Observación - ${new Date().toLocaleDateString()}`);
      // También podríamos relacionarlo con la observación si el modelo lo permite, 
      // pero por ahora lo guardamos en el repositorio general del estudiante.
      await uploadOfficialDocument(uploadFd);
    }

    revalidatePath(`/dashboard/observador/${studentId}`);
    revalidatePath("/dashboard/observador");
    return { success: true, data: observation };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al crear la observación." };
  }
}

export async function addFollowUp(data: {
  observationId: string;
  description: string;
}) {
  const followUp = await prisma.followUp.create({
    data: {
      observationId: data.observationId,
      description: data.description,
    },
    include: {
      observation: true
    }
  });

  // Check the "3 follow-ups" rule
  const studentId = followUp.observation.studentId;
  const followUpCount = await prisma.followUp.count({
    where: {
      observation: {
        studentId: studentId
      }
    }
  });

  if (followUpCount >= 3) {
    await prisma.student.update({
      where: { id: studentId },
      data: { isConditional: true }
    });
  }

  revalidatePath(`/dashboard/observador/${studentId}`);
  return followUp;
}

export async function scheduleParentMeeting(data: {
  studentId: string;
  teacherId: string;
  observationId?: string;
  date: Date;
  notes?: string;
}) {
  const meeting = await prisma.parentMeeting.create({
    data: {
      studentId: data.studentId,
      teacherId: data.teacherId,
      observationId: data.observationId,
      date: data.date,
      notes: data.notes,
    }
  });

  revalidatePath(`/dashboard/observador/${data.studentId}`);
  return meeting;
}

export async function updateMeetingStatus(meetingId: string, status: MeetingStatus, notes?: string) {
  const meeting = await prisma.parentMeeting.update({
    where: { id: meetingId },
    data: { status, notes },
    include: { student: true }
  });

  revalidatePath(`/dashboard/observador/${meeting.studentId}`);
  return meeting;
}

export async function addAgreement(data: {
  description: string;
  observationId?: string;
  parentMeetingId?: string;
  studentId: string;
}) {
  const agreement = await prisma.agreement.create({
    data: {
      description: data.description,
      observationId: data.observationId,
      parentMeetingId: data.parentMeetingId,
    }
  });

  revalidatePath(`/dashboard/observador/${data.studentId}`);
  return agreement;
}

export async function toggleConditionalEnrollment(studentId: string, status: boolean) {
  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { isConditional: status }
    });
    revalidatePath("/dashboard/observador");
    revalidatePath(`/dashboard/observador/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al actualizar matrícula condicional." };
  }
}
