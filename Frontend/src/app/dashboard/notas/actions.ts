"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getStudentGrades() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "STUDENT") return null;

  const username = (session.user as any).username;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      studentProfile: {
        include: {
          course: {
            include: {
              assignments: {
                include: {
                  subject: {
                    include: {
                      gradingConfig: true
                    }
                  },
                  grades: {
                    include: {
                      period: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const student = user?.studentProfile;
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
