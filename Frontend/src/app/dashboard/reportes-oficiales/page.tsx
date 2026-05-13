import { prisma } from "@/lib/prisma";
import { OfficialReportsUI } from "./OfficialReportsUI";
import { getMissingSIMATData } from "./actions";

export default async function ReportesOficialesPage() {
  const missingData = await getMissingSIMATData();
  const academicYears = await prisma.academicYear.findMany({
    orderBy: { name: 'desc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Centro de Reportes Oficiales</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generación de archivos para SIMAT (Anexo 6A), DANE (C-600) y auditoría normativa.</p>
      </div>

      <OfficialReportsUI 
        missingData={missingData} 
        academicYears={academicYears}
      />
    </div>
  );
}
