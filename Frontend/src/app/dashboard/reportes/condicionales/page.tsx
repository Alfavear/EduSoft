import { prisma } from "@/lib/prisma";
import { ShieldAlert, ChevronLeft, Printer } from "lucide-react";
import Link from "next/link";
import PrintButton from "../../observador/[studentId]/report/PrintButton";

export default async function ConditionalStudentsReportPage() {
  const students = await prisma.student.findMany({
    where: { isConditional: true },
    include: {
      course: true,
      _count: {
        select: { observations: true }
      }
    },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/dashboard/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ChevronLeft size={16} />
          Volver a Reportes
        </Link>
        <PrintButton />
      </div>

      <div className="card-premium" style={{ padding: '3rem', backgroundColor: 'white', color: 'black' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #991b1b', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', color: '#991b1b' }}>
            Reporte de Matrículas Condicionales
          </h1>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#444' }}>
            Institución Educativa EduSoft
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Estudiantes en situación de seguimiento crítico
          </p>
        </header>

        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666', fontStyle: 'italic' }}>
            No se encuentran estudiantes con matrícula condicional actualmente.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fef2f2', borderBottom: '2px solid #fee2e2' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Estudiante</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Grado</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Total Observaciones</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{student.lastName}, {student.firstName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {student.documentId}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{student.course.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <strong>{student._count.observations}</strong>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '0.8rem' }}>CONDICIONAL</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
              Coordinación de Convivencia
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
              Rectoría
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
          .card-premium { box-shadow: none !important; border: none !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
