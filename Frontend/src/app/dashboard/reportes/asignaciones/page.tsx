import { prisma } from "@/lib/prisma";
import { BookOpen, ChevronLeft, Printer } from "lucide-react";
import Link from "next/link";
import PrintButton from "../../observador/[studentId]/report/PrintButton";

export default async function AcademicLoadReportPage() {
  const courses = await prisma.course.findMany({
    include: {
      assignments: {
        include: {
          subject: true,
          teacher: true
        },
        orderBy: { subject: { name: 'asc' } }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/dashboard/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ChevronLeft size={16} />
          Volver a Reportes
        </Link>
        <PrintButton />
      </div>

      <div className="card-premium" style={{ padding: '3rem', backgroundColor: 'white', color: 'black' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Estructura Curricular y Asignaciones Académicas
          </h1>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#444' }}>
            Institución Educativa EduSoft
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Resumen detallado de la carga académica por grado
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
          {courses.map((course) => (
            <div key={course.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', breakInside: 'avoid' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Grado: {course.name}
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', color: '#666' }}>
                    <th style={{ padding: '0.5rem' }}>Asignatura</th>
                    <th style={{ padding: '0.5rem' }}>Docente</th>
                  </tr>
                </thead>
                <tbody>
                  {course.assignments.map((as) => (
                    <tr key={as.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '0.5rem', fontWeight: '500' }}>{as.subject.name}</td>
                      <td style={{ padding: '0.5rem' }}>{as.teacher.firstName} {as.teacher.lastName}</td>
                    </tr>
                  ))}
                  {course.assignments.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic', color: '#999' }}>
                        No hay asignaciones registradas para este curso.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.75rem', color: '#999' }}>
          Documento generado por el sistema de gestión académica EduSoft.
        </footer>
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
