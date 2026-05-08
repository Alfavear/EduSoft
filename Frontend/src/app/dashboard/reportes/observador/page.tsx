import { prisma } from "@/lib/prisma";
import { ClipboardList, ChevronLeft, Search, FileText } from "lucide-react";
import Link from "next/link";

export default async function ObservadorReportListPage() {
  const students = await prisma.student.findMany({
    include: {
      course: true,
      _count: {
        select: { observations: true }
      }
    },
    orderBy: [
      { course: { name: 'asc' } },
      { lastName: 'asc' }
    ]
  });

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/dashboard/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '0.5rem' }}>
            <ChevronLeft size={16} />
            Volver a Reportes
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ClipboardList size={32} />
            Expedientes de Observador
          </h1>
        </div>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Estudiante</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Grado</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Observaciones</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{student.lastName}, {student.firstName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {student.documentId}</div>
                </td>
                <td style={{ padding: '1rem' }}>{student.course.name}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ 
                    backgroundColor: student._count.observations > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)', 
                    color: student._count.observations > 0 ? 'var(--color-danger)' : 'var(--text-muted)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {student._count.observations}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link 
                    href={`/dashboard/observador/${student.id}/report`}
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                  >
                    <FileText size={16} />
                    Generar Expediente
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
