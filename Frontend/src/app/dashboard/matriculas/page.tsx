import { getEnrollments } from "./actions";
import { prisma } from "@/lib/prisma";
import { EnrollmentManager } from "./EnrollmentManager";

export default async function MatriculasPage() {
  const activeYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: { periods: true }
  });

  const enrollments = await getEnrollments({
    academicYearId: activeYear?.id
  });

  const courses = await prisma.course.findMany({
    orderBy: { name: 'asc' }
  });

  const academicYears = await prisma.academicYear.findMany({
    orderBy: { name: 'desc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Matrículas y Promoción</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestión del ciclo de vida académico - Normativa Decreto 1290</p>
      </div>

      <EnrollmentManager 
        initialEnrollments={enrollments} 
        courses={courses}
        academicYears={academicYears}
        activeYearId={activeYear?.id}
      />
    </div>
  );
}
