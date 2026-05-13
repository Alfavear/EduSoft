import { prisma } from "@/lib/prisma";
import { ReportConfigManager } from "./ReportConfigManager";

export default async function ReportesPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' }
  });

  const activeYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: { periods: true }
  });

  const courses = await prisma.course.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Generación de Boletines</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configuración de indicadores, puestos e impresión de informes académicos.</p>
      </div>

      <ReportConfigManager 
        subjects={subjects} 
        periods={activeYear?.periods || []}
        courses={courses}
      />
    </div>
  );
}
